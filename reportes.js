document.getElementById('formulario').addEventListener('submit', function(e) {
  e.preventDefault();

  const formulario = this;
  const imagenInput = document.getElementById('imagen');
  const archivo = imagenInput.files[0];

  const loader = document.getElementById('loader');
  const loaderText = document.getElementById('loaderText'); // ⭐ Nuevo
  const boton = formulario.querySelector('button');

  loader.style.display = 'block';
  loaderText.textContent = archivo ? 'Subiendo imagen...' : 'Enviando reporte...'; // ⭐
  boton.disabled = true;

  if (archivo) {
    const formData = new FormData();
    formData.append('file', archivo);
    formData.append('upload_preset', 'reporte_unsigned');

    fetch('https://api.cloudinary.com/v1_1/dsozbhspf/image/upload', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      const resizedUrl = data.secure_url.replace('/upload/', '/upload/w_700,h_500,c_fit/');
      document.getElementById('imagen_url').value = resizedUrl;
      loaderText.textContent = 'Enviando reporte...'; // ⭐
      enviarFormulario();
    })
    .catch(err => {
      loader.style.display = 'none';
      loaderText.textContent = 'Error al subir la imagen'; // ⭐
      boton.disabled = false;
      alert('Error al subir la imagen a Cloudinary: ' + err.message);
    });
  } else {
    enviarFormulario();
  }

  function enviarFormulario() {
    emailjs.sendForm('service_it3bf5o', 'template_5j0jyhg', formulario)
      .then(() => {
        loaderText.textContent = '¡Reporte enviado con éxito!'; // ⭐
        setTimeout(() => {
          loader.style.display = 'none';
          loaderText.textContent = '';
        }, 1500); // se oculta 1.5 segundos después

        boton.disabled = false;
        document.getElementById('mensajeExito').style.display = 'block';
        formulario.reset();
      }, (error) => {
        loader.style.display = 'none';
        loaderText.textContent = 'Error al enviar el formulario'; // ⭐
        boton.disabled = false;
        alert('Error al enviar el formulario: ' + JSON.stringify(error));
      });
  }
});
