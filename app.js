const challenges = [
  {topic:"Buenas prácticas",question:"¿Cuál es la mejor forma de proteger tus cuentas?",answers:["Usar la misma contraseña en todas partes","Usar contraseñas únicas y activar la verificación en dos pasos","Compartir la contraseña con alguien de confianza"],correct:1,explanation:"Correcto: una contraseña diferente para cada servicio limita el impacto si una cuenta se ve comprometida. La verificación en dos pasos añade otra barrera."},
  {topic:"Detectar phishing",question:"Recibes un correo que exige verificar tu cuenta en 10 minutos mediante un enlace extraño. ¿Qué haces?",answers:["Pulso rápido para evitar el bloqueo","Respondo con mis datos para comprobarlo","No pulso el enlace y verifico desde la web o app oficial"],correct:2,explanation:"Correcto: la urgencia y los enlaces inesperados son señales de alerta. Entra por la aplicación o dirección oficial, no por el enlace del mensaje."},
  {topic:"Conexiones seguras",question:"Estás usando una Wi-Fi pública. ¿Qué hábito es más prudente?",answers:["Evitar operaciones sensibles y mantener el dispositivo actualizado","Desactivar todas las medidas de seguridad","Conectarme a cualquier red con nombre conocido"],correct:0,explanation:"Correcto: evita operaciones sensibles en redes que no controlas, desactiva la conexión automática y utiliza sitios y aplicaciones oficiales."},
  {topic:"Mantenimiento",question:"Tu dispositivo ofrece una actualización de seguridad oficial. ¿Qué conviene hacer?",answers:["Ignorarla indefinidamente","Instalarla desde los ajustes oficiales cuando sea posible","Descargar un archivo de una web desconocida"],correct:1,explanation:"Correcto: las actualizaciones corrigen fallos conocidos. Instálalas desde los ajustes del dispositivo o la tienda oficial."}
];
let current = 0;
let answered = false;
let completed = JSON.parse(localStorage.getItem("cyberstart-completed") || "[]");
const $ = (id) => document.getElementById(id);

function renderChallenge(index) {
  current = index; answered = false;
  const item = challenges[index];
  $("quiz-index").textContent = String(index + 1).padStart(2,"0");
  $("quiz-topic").textContent = item.topic;
  $("quiz-question").textContent = item.question;
  $("feedback").textContent = "Elige una respuesta para ver la explicación.";
  $("complete-button").disabled = true;
  $("complete-button").textContent = completed.includes(index) ? "Reto completado ✓" : "Marcar reto completado";
  $("answers").innerHTML = "";
  item.answers.forEach((answer, answerIndex) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = answer;
    button.addEventListener("click", () => chooseAnswer(answerIndex));
    $("answers").appendChild(button);
  });
  document.querySelectorAll(".challenge-item").forEach((button,i) => button.classList.toggle("active",i===index));
}
function chooseAnswer(answerIndex) {
  if (answered) return;
  answered = true;
  const item = challenges[current];
  [...$("answers").children].forEach((button,i) => {
    button.disabled = true;
    if (i === item.correct) button.classList.add("correct");
    else if (i === answerIndex) button.classList.add("wrong");
  });
  $("feedback").textContent = (answerIndex === item.correct ? "¡Bien hecho! " : "No es la opción más segura. ") + item.explanation;
  $("complete-button").disabled = answerIndex !== item.correct || completed.includes(current);
}
function updateProgress() {
  const count = completed.length, percent = Math.round(count / challenges.length * 100);
  $("completed-count").textContent = `${count} / ${challenges.length}`;
  $("progress-number").textContent = `${percent}%`;
  $("progress-bar").style.width = `${percent}%`;
  document.querySelector(".ring").style.background = `conic-gradient(var(--accent) ${percent*3.6}deg,#2b3650 0deg)`;
  document.querySelectorAll(".challenge-item").forEach((button,i) => {
    const label = button.querySelector("b");
    label.textContent = completed.includes(i) ? "✓" : "→";
  });
}
document.querySelectorAll(".challenge-item").forEach(button => button.addEventListener("click", () => renderChallenge(Number(button.dataset.challenge))));
$("complete-button").addEventListener("click", () => {
  if (!completed.includes(current)) completed.push(current);
  localStorage.setItem("cyberstart-completed",JSON.stringify(completed));
  updateProgress();
  renderChallenge(current);
});
updateProgress();
renderChallenge(0);
