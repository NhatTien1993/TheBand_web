const btnBuytickets = document.querySelectorAll('.js-buy-ticket')
const modal = document.querySelector('.modal')
const closeModal = document.querySelector('.js-close-icon')
const modalContainer = document.querySelector('.js-modal-container')

// console.log(albumContent)
for (const btnBuyticket of btnBuytickets) {
    btnBuyticket.addEventListener('click', function () {
        modal.classList.add('open-modal')
    })
};
closeModal.addEventListener('click', function () {
    modal.classList.remove('open-modal')
})
modal.addEventListener('click', function () {
    modal.classList.remove('open-modal')
})
modalContainer.addEventListener('click', function (event) {
    event.stopPropagation()
})
// Đóng menu khi click Nav bar
var header = document.getElementById('header')
var menuItems = document.querySelectorAll('#nav>li>a')

var menuBar = document.getElementById('mobie-menu')
menuBar.onclick = function () {
    var isClose = header.clientHeight === 47;
    if (isClose) {
        header.classList.add('header--open')
    } else {
        header.classList.remove('header--open')

    }
}
for (const menuItem of menuItems) {
    menuItem.onclick = function () {
        header.classList.remove('header--open');
    }
}
//Show play btn
const album = document.querySelector('.album')
const albumContent = document.querySelector('.album-content')
const playerRouter = document.querySelector('#playerRouter')

function handleFocusAlbum() {
    albumContent.classList.add('active')

}
function handleLeaveAlbum() {

    albumContent.classList.remove('active')

    albumContent.classList.add('unactive')

    setTimeout(() => {
        albumContent.classList.remove('unactive')
    }, 300)

}
function handleClick() {
    playerRouter.submit()
}

//Toast message
var nameInput;
var emailInput;
var messageInput;
const inputName = document.querySelector('.name')
const inputEmail = document.querySelector('.email')
const inputMessage = document.querySelector('.message')
const inputSubmit = document.querySelector('.submit')
function onChange() {
    nameInput = inputName.value
    emailInput = inputEmail.value
    messageInput = inputMessage.value
}
function onSubmit() {
    pressSuccess()
}
function toastOut({ tittle, message,
    type, duration }) {
    const main = document.getElementById('toast');

    if (toast) {
        const toast = document.createElement('div');

        const icons = {
            success: 'fa-circle-check',
            info: 'fa-circle-info',
            error: 'fa-circle-exclamation'
        }
        const delay = (duration / 1000).toFixed(2)
        // auto close
        const autoClose = setTimeout(function () {
            main.removeChild(toast)
        }, duration + 1000)
        // click to close
        toast.onclick = function (e) {
            if (e.target.closest('.toast__close')) {
                main.removeChild(toast)
                clearTimeout(autoClose)
            }
        }
        // Show toast
        toast.classList.add('toast', `toast--${type}`)
        toast.style.animation = `slideInLeft ease 0.5s,fadeOut linear 0.7s ${delay}s forwards`;
        toast.innerHTML = `
        <div class="toast__icon">
            <i class="fa-solid ${icons[type]}"></i>
        
        </div>
        <div class="toast__body">
            <h3 class="toast__tittle">${tittle}</h3>
            <p class="toast__msg">${message}</p>
        </div>
        <div class="toast__close">
            <i class="fa-solid fa-xmark"></i>
        </div> `;
        main.appendChild(toast);


    }
}
function pressSuccess() {
    toastOut({
        tittle: 'Contact',
        message: 'Gửi thành công !',
        type: 'success',
        duration: 3000
    })
}
function pressInfo() {
    if (!nameInput || !emailInput || !messageInput) {
        toastOut({
            tittle: 'Info',
            message: 'Vui lòng điền đầy đủ thông tin!',
            type: 'info',
            duration: 3000
        })
    }

}
function pressError() {
    toastOut({
        tittle: 'Thất bại',
        message: 'Đăng nhập thất bại !',
        type: 'error',
        duration: 3000
    })
}