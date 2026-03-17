let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const botones = document.querySelectorAll(".btn-agregar");

botones.forEach(boton=>{
boton.addEventListener("click",()=>{

const producto = boton.parentElement;

const nombre = producto.dataset.nombre;
const precio = parseInt(producto.dataset.precio);

carrito.push({nombre,precio});

localStorage.setItem("carrito",JSON.stringify(carrito));

});
});

const lista = document.getElementById("lista-carrito");
const total = document.getElementById("total");

function actualizarCarrito(){

if(!lista) return;

lista.innerHTML="";

let totalCompra=0;

carrito.forEach((producto,index)=>{

const li=document.createElement("li");

li.innerHTML=`
${producto.nombre} - $${producto.precio}
<button onclick="eliminarProducto(${index})">❌</button>
`;

lista.appendChild(li);

totalCompra+=producto.precio;

});

total.textContent=totalCompra;

}

function eliminarProducto(index){

carrito.splice(index,1);

localStorage.setItem("carrito",JSON.stringify(carrito));

actualizarCarrito();

}

function comprarWhatsApp(){

let mensaje="Hola quiero comprar:%0A";

let totalCompra=0;

carrito.forEach(p=>{

mensaje+=`• ${p.nombre} - $${p.precio}%0A`;

totalCompra+=p.precio;

});

mensaje+=`Total: $${totalCompra}`;

window.open(`https://wa.me/573183880873?text=${mensaje}`);

}

actualizarCarrito();
