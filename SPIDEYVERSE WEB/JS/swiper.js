document.addEventListener("DOMContentLoaded", function () {
const swiper = new Swiper(".actorSwiper",{

    slidesPerView:3,

    centeredSlides:true,

    spaceBetween:35,

    loop:true,

    speed:900,

    grabCursor:true,

    allowTouchMove:true,

    navigation:{

        nextEl:".swiper-button-next",

        prevEl:".swiper-button-prev",

    },

    pagination:{

        el:".swiper-pagination",

        clickable:true,

    },

    breakpoints:{

        0:{

            slidesPerView:1,

        },

        768:{

            slidesPerView:2,

        },

        1200:{

            slidesPerView:3,

        }

    }

});
	});