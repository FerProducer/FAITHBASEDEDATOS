function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.openById('1F45vywnlAa3s66OAo1Q3IGuz6URKCGj6RIOCCkK4b20');
  const membresias = ss.getSheetByName('Membresías');
  if(data.action == "register") {
    const user = Utilities.getUuid().slice(0,8);
    const pass = Utilities.getUuid().slice(0,8);
    membresias.appendRow([
      new Date().getTime(), data.nombre, data.correo, data.telefono,
      new Date(), data.membresia, "Activa", "", user, pass, "MercadoPago", ""
    ]);
    MailApp.sendEmail({
      to: data.correo,
      subject: "Bienvenido a FAITHGYM",
      htmlBody: `Hola ${data.nombre},<br>
      Tu usuario: <b>${user}</b><br>
      Tu contraseña: <b>${pass}</b><br>
      Accede aquí: <a href="https://TU_DOMINIO/panel.html">Panel de usuario</a>`
    });
    return output({success:true});
  }
  if(data.action == "login") {
    const users = membresias.getDataRange().getValues();
    const u = users.find(r=>r[8]==data.usuario && r[9]==data.password);
    if(u){
      const pagosSheet = ss.getSheetByName('Pagos');
      const pagos = pagosSheet.getDataRange().getValues().filter(p=>p[1]==u[8])
        .map(p=>({fecha:p[2], monto:p[3], estado:p[6]}));
      return output({
        success:true,
        user:{
          nombre:u[1], correo:u[2], membresia:u[5], estado:u[6], pagos
        }
      });
    }
    return output({success:false});
  }
}
function output(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
