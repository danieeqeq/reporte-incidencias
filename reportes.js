 document.getElementById('formulario').addEventListener('submit', function(e) {
    e.preventDefault();

    const formulario = this;
    const imagenInput = document.getElementById('imagen');
    const archivo = imagenInput.files[0];
    const loader = document.getElementById('loader');
    const loaderText = document.getElementById('loaderText');
    const boton = formulario.querySelector('button');

    loader.style.display = 'block';
    loaderText.textContent = archivo ? 'Subiendo imagen...' : 'Enviando reporte...';
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
        loaderText.textContent = 'Enviando reporte...';
        enviarFormulario();
      })
      .catch(err => {
        loader.style.display = 'none';
        loaderText.textContent = 'Error al subir la imagen';
        boton.disabled = false;
        alert('Error al subir la imagen a Cloudinary: ' + err.message);
      });
    } else {
      enviarFormulario();
    }

    function enviarFormulario() {
      // 🔵 1. Guardar en Google Sheets primero
      const datosParaSheet = {
        ficha: formulario.ficha.value,
        area: formulario.area.value,
        detalle: formulario.detalle.value
      };

      fetch('https://script.google.com/macros/s/AKfycbygsQRJ1X8AGTE_ldYQ9Xru4E9XkqlTwDfBZsU1vPA4n6ktc2AClzDNFcgL5SGDOLsBzg/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosParaSheet)
      })
      .then(res => res.text())
      .then(res => {
        console.log('✅ Guardado en Google Sheets:', res);
      })
      .catch(err => {
        console.error('❌ Error al guardar en hoja:', err);
        alert('Error al guardar en Google Sheets: ' + err.message);
      });

      // 🔵 2. Enviar correo con EmailJS
      emailjs.sendForm('service_runxke7', 'template_qazaiod', formulario)
        .then(() => {
          loaderText.textContent = '¡Reporte enviado con éxito!';
          setTimeout(() => {
            loader.style.display = 'none';
            loaderText.textContent = '';
          }, 1500);
          boton.disabled = false;
          document.getElementById('mensajeExito').style.display = 'block';
          formulario.reset();
        })
        .catch((error) => {
          loader.style.display = 'none';
          loaderText.textContent = 'Error al enviar el formulario';
          boton.disabled = false;
          alert('Error al enviar el formulario: ' + JSON.stringify(error));
        });
    }
  });
