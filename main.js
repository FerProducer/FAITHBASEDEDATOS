const scriptURL = 'https://script.google.com/macros/s/AKfycbwT2E9uNS9PtvygQKb3esT7nxgEC3frZ8H1k1CnGrL1C2r5Cyz_WRdnlx8zeQ9I9Gs0/exec';

// Registro
document.getElementById('registerForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const data = {
    action: "register",
    nombre: form.nombre.value,
    correo: form.correo.value,
    telefono: form.telefono.value,
    membresia: form.membresia.value
  };
  const res = await fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'}
  });
  const result = await res.json();
  if(result.success){
    alert('Registro exitoso. Revisa tu correo.');
    window.location.href = 'login.html';
  } else {
    alert('Error al registrar.');
  }
});

// Login
document.getElementById('loginForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const data = {
    action: "login",
    usuario: form.usuario.value,
    password: form.password.value
  };
  const res = await fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'}
  });
  const result = await res.json();
  if(result.success){
    localStorage.setItem('userData', JSON.stringify(result.user));
    window.location.href = 'panel.html';
  } else {
    document.getElementById('loginError').innerText = 'Credenciales incorrectas';
  }
});

// Panel
if(document.getElementById('userName')) {
  const user = JSON.parse(localStorage.getItem('userData'));
  if(!user) window.location.href = 'login.html';
  document.getElementById('userName').innerText = user.nombre;
  document.getElementById('status').innerText = user.estado;
  document.getElementById('type').innerText = user.membresia;
  let html = '';
  user.pagos.forEach(p=>{
    html += `<p>${p.fecha}: $${p.monto} (${p.estado})</p>`;
  });
  document.getElementById('payments').innerHTML = html;
}

// Logout
function logout() {
  localStorage.removeItem('userData');
  window.location.href = 'login.html';
}
