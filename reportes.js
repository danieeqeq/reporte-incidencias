document.getElementById('formulario').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const formulario = this;
    const imagenInput = document.getElementById('imagen');
    const archivo = imagenInput.files[0];
  
    if (archivo) {
      const formData = new FormData();
      formData.append('file', archivo);
      formData.append('upload_preset', 'reporte_unsigned'); // Tu preset de Cloudinary
  
      // Subir imagen a Cloudinary
      fetch('https://api.cloudinary.com/v1_1/dsozbhspf/image/upload', {
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        // Redimensionar imagen automáticamente con Cloudinary (600x400)
        const resizedUrl = data.secure_url.replace('/upload/', '/upload/w_700,h_500,c_fit/');
  
        // Insertar imagen HTML con tamaño fijo (para que se vea bien en Gmail)
        const imagenHTML = `<img src="${resizedUrl}" style="max-width:400px; height:auto;" />`;
  
        // Guardar HTML en el campo oculto
        document.getElementById('imagen_url').value = imagenHTML;
  
        enviarFormulario();
      })
      .catch(err => {
        alert('Error al subir la imagen a Cloudinary: ' + err.message);
      });
    } else {
      enviarFormulario(); // Enviar sin imagen
    }
  
    function enviarFormulario() {
      emailjs.sendForm('service_it3bf5o', 'template_5j0jyhg', formulario)
        .then(() => {
          document.getElementById('mensajeExito').style.display = 'block';
          formulario.reset();
        }, (error) => {
          alert('Error al enviar el formulario: ' + JSON.stringify(error));
        });
    }
  });
