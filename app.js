const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

//eventos
document.addEventListener('DOMContentLoaded', e => { 
    fetchData()
    if(localStorage.getItem("carrito")){
        carrito = JSON.parse(localStorage.getItem("carrito"))
        crearCarrito()
        }        
    });
cards.addEventListener('click', e => { addCarrito(e) });
items.addEventListener('click', e => { btnSumarRestar(e) })

//traer productos
const fetchData = async () => {
    const res = await fetch('data.json');
    const data = await res.json()
    
    crearCards(data)
}

//crear productos
const crearCards = data => {
    data.forEach(item => {
        templateCard.querySelector('h5').textContent = item.title
        templateCard.querySelector('p').textContent = item.precio
        templateCard.querySelector('img').setAttribute("src", item.img)
        templateCard.querySelector('button').dataset.id = item.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

//boton agregar al carrito
const addCarrito = e => {
    if (e.target.classList.contains('btn-warning')) {
        
        setCarrito(e.target.parentElement)
        Toastify({
            text: `Producto  agregado!`,
            className: "info",
            duration: 3000
        }).showToast();
    }
    e.stopPropagation()
}
//creacion de producto y contador
const setCarrito = item => {
    const producto = {
        title: item.querySelector('h5').textContent,
        precio: item.querySelector('p').textContent,
        id: item.querySelector('button').dataset.id,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = { ...producto }
    
    crearCarrito()
}
//tabla del carrito con productos seleccionados
const crearCarrito = () => {
    items.innerHTML = ''

    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad
        
        //botones
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-warning').dataset.id = producto.id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    crearFooter()

    localStorage.setItem("carrito", JSON.stringify(carrito))
}
//pie de la tabla
const crearFooter = () => {
    footer.innerHTML = ''
    
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío</th>`
        return
    }
    
            //sumar cantidad y sumar totales
        const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
        const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
        
        templateFooter.querySelectorAll('td')[0].textContent = nCantidad
        templateFooter.querySelector('span').textContent = nPrecio

        const clone = templateFooter.cloneNode(true)
        fragment.appendChild(clone)

        footer.appendChild(fragment)
            // boton vaciar carrito
        const boton = document.querySelector('#vaciar-carrito')
        boton.addEventListener('click', () => {
            carrito = {}
            crearCarrito()
        })

            // boton pagar
        const pagar = document.querySelector('#pagarTotal')

        pagar.addEventListener('click', () => {
            //cuando se hace click, se solicita email, para envio del comprobante
            Swal.fire({
            title: 'Ingresa tu email',
            input: 'email',
            inputLabel: 'Te enviaremos el comprobante de pago\n      ¡¡Muchas gracias por tu compra!!',
            inputPlaceholder: 'Ejemplo: fulanito@email.com'
          })
          
        if (email) {
        Swal.fire(`Entered email: ${email}`)

        };
        
        crearCarrito();
    })
}
//botones agregar y quitar del carrito y contador
const btnSumarRestar = e => {
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        crearCarrito()
    }
//boton quitar del carrito
    if (e.target.classList.contains('btn-warning')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        crearCarrito()
    }
    e.stopPropagation()
}

//completar formulario
const form = document.querySelector('form');
const completarpagoButton = document.querySelector('button#pagarTotal');

form.addEventListener('submit', completarFormulario);                       

function completarFormulario(event) {
  event.preventDefault();
  validate();
  form.reportValidity();
  if (form.checkValidity() === false) {

  } else {

    completarpagoButton.textContent = 'Procesando pago...';
    completarpagoButton.disabled = 'true';
    alert('¡Pago Realizado!');
    completarpagoButton.textContent = 'Pagado!';
  }
}

function validate() {

}
