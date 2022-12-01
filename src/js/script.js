$(document).ready(function(){
    $('.carousel__inner').slick({
        speed: 1200,
        prevArrow: '<button type="button" class="slick-prev"> <img src="icons/left.svg"> </button>',
        nextArrow: '<button type="button" class="slick-next"> <img src="icons/right.svg"> </button>',
    });

    $('ul.catalog__tabs').on('click', 'li:not(.catalog__tab_active)', function() {
        $(this)
          .addClass('catalog__tab_active').siblings().removeClass('catalog__tab_active')
          .closest('div.container').find('div.catalog__content').removeClass('catalog__content_active').eq($(this).index()).addClass('catalog__content_active');
      });
    
      function toggleSlide(item) {
        $(item).each(function(i) {
            $(this).on('click', function(e) {
                e.preventDefault();
                $('.catalog-item__content').eq(i).toggleClass('catalog-item__content_active');
                $('.catalog-item__list').eq(i).toggleClass('catalog-item__list_active');
            })
        });
    }

    toggleSlide('.catalog-item__link');
    toggleSlide('.catalog-item__back');

    $('[data-modal=consultation]').on('click', function() {
        $('.overlay, #consultation').fadeIn('slow');
    });
    $('.modal__close').on('click', function() {
        $('.overlay, #consultation, #order, #thanks').fadeOut('slow');
    });
    $('.button_mini').on('click', function() {
        $('.overlay, #order').fadeIn('slow');
    });

    $('form').submit(function(e) {
        e.preventDefault();

        if (!$(this).valid()) {
            return;
        }

        $.ajax({
            type: "POST",
            url: "mailer/smart.php",
            data: $(this).serialize()
        }).done(function() {
            $(this).find("input").val("");


            $('form').trigger('reset')
        });
        return false;
    });


    // smooth scroll 
    $(window).scroll(function() {
        if ($(this).scrollTop() > 1600) {
            $('.pageup').fadeIn();
        } else {
            $('.pageup').fadeOut();
        }
    });

    $("a[href^='#']").click(function(){
        var _href = $(this).attr("href");
        $("html, body").animate({scrollTop: $(_href).offset().top+"px"});
        return false;
    });

    new WOW().init();
});



  //___________________________________________________

  function calc() {

    const result = document.querySelector('.calculating__result span');

    let day, amount, category;

    if (localStorage.getItem('day')) {
        day = localStorage.getItem('day');
    }else {
        day = 'weekdays';
        localStorage.setItem('day', 'weekdays');
    }

    if (localStorage.getItem('category')) {
        category = localStorage.getItem('category');
    }else {
        category = '1';
        localStorage.setItem('category', '1');
    }

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if(elem.getAttribute('id') === localStorage.getItem('day')) {
                elem.classList.add(activeClass);
            }
            if (elem.getAttribute('data-category') === localStorage.getItem('category')) {
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#day div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function calcTotal() {
        if (!day || !amount || !category) {
            result.textContent = '0';
            return;
        }

        if (day == 'weekdays') {
            result.textContent = 10 * 1 * amount * category;
        }else {
            result.textContent = 10 * 1.5 * amount * category;
        }
    }
         
    calcTotal();

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-category')) {
                    ratio = +e.target.getAttribute('data-category');
                    localStorage.setItem('category', +e.target.getAttribute('data-category'));
                    category = localStorage.getItem('category');
                }else {
                    day = e.target.getAttribute('id');
                    localStorage.setItem('day', e.target.getAttribute('id'));
                    day = localStorage.getItem('day');
                }
    
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
    
                e.target.classList.add(activeClass);
    
                calcTotal();
            });
        });
    }

    getStaticInformation('#day div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red';
            }else {
                input.style.border = 'none';
            }

            switch(input.getAttribute('id')) {
                case 'amount':
                    amount = +input.value;
                    break;  
            }
            calcTotal();
        });
    }

    getDynamicInformation('#amount');
}

function timer(id, deadline) {

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor( (t/(1000*60*60*24)) ),
            seconds = Math.floor( (t/1000) % 60 ),
            minutes = Math.floor( (t/1000/60) % 60 ),
            hours = Math.floor( (t/(1000*60*60) % 24) );

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num){
        if (num >= 0 && num < 10) { 
            return '0' + num;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {

        const timer = document.querySelector(selector),
            days = timer.querySelector("#days"),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock(id, deadline);
}

//____________________________________________________
// function closeModal(modalSelector) {
//     const modal = document.querySelector(modalSelector);

//     modal.classList.add('hide');
//     modal.classList.remove('show');
//     document.body.style.overflow = '';
// }

// function openModal(modalSelector, modalTimerId) {
//     const modal = document.querySelector(modalSelector);

//     modal.classList.add('show');
//     modal.classList.remove('hide');
//     document.body.style.overflow = 'hidden';

//     if (modalTimerId) {
//         clearInterval(modalTimerId);
//     }
// }

// function modal(trigerSelector, modalSelector, modalTimerId) {

//     const modalTrigger = document.querySelectorAll(trigerSelector),
//         modal = document.querySelector(modalSelector);

//     modalTrigger.forEach(btn => {
//         btn.addEventListener('click', () => openModal(modalSelector, modalTimerId));
//     });

//     modal.addEventListener('click', (e) => {
//         if (e.target === modal || e.target.getAttribute('data-close') == "") {
//             closeModal(modalSelector);
//         }
//     });

//     document.addEventListener('keydown', (e) => {
//         if (e.code === "Escape" && modal.classList.contains('show')) { 
//             closeModal(modalSelector);
//         }
//     });

//     function showModalByScroll() {
//         if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
//             openModal(modalSelector, modalTimerId);
//             window.removeEventListener('scroll', showModalByScroll);
//         }
//     }
//     window.addEventListener('scroll', showModalByScroll);
// }

// const postData = async (url, data) => {
//     let res = await fetch(url, {
//         method: "POST",
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: data
//     });

//     return await res.json();
// };

// async function getResource(url) {
//     let res = await fetch(url);

//     if (!res.ok) {
//         throw new Error(`Could not fetch ${url}, status: ${res.status}`);
//     }

//     return await res.json();
// }

// function forms(formSelector, modalTimerId) {
//     // Forms

//     const forms = document.querySelectorAll(formSelector);
//     const message = {
//         loading: 'img/form/spinner.svg',
//         success: 'Спасибо! Скоро мы с вами свяжемся',
//         failure: 'Что-то пошло не так...'
//     };

//     forms.forEach(item => {
//         bindPostData(item);
//     });

//     function bindPostData(form) {
//         form.addEventListener('submit', (e) => {
//             e.preventDefault();

//             let statusMessage = document.createElement('img');
//             statusMessage.src = message.loading;
//             statusMessage.style.cssText = `
//                 display: block;
//                 margin: 0 auto;
//             `;
//             form.insertAdjacentElement('afterend', statusMessage);
        
//             const formData = new FormData(form);

//             const json = JSON.stringify(Object.fromEntries(formData.entries()));

//             postData('http://localhost:3000/requests', json)
//             .then(data => {
//                 console.log(data);
//                 showThanksModal(message.success);
//                 statusMessage.remove();
//             }).catch(() => {
//                 showThanksModal(message.failure);
//             }).finally(() => {
//                 form.reset();
//             });
//         });
//     }

//     function showThanksModal(message) {
//         const prevModalDialog = document.querySelector('.modal__dialog');

//         prevModalDialog.classList.add('hide');
//         openModal('.modal', modalTimerId);

//         const thanksModal = document.createElement('div');
//         thanksModal.classList.add('modal__dialog');
//         thanksModal.innerHTML = `
//             <div class="modal__content">
//                 <div class="modal__close" data-close>×</div>
//                 <div class="modal__title">${message}</div>
//             </div>
//         `;
//         document.querySelector('.modal').append(thanksModal);
//         setTimeout(() => {
//             thanksModal.remove();
//             prevModalDialog.classList.add('show');
//             prevModalDialog.classList.remove('hide');
//             closeModal('.modal');
//         }, 4000);
//     }
// }
  
window.addEventListener('DOMContentLoaded', function() {

    // const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 300000);

    // modal('[data-modal]', '.modal', modalTimerId);
    timer('.timer', '2022-12-21');
    calc();
    // forms('form', modalTimerId);
});