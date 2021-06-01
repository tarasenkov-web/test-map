// jQuery.noConflict();
jQuery(document).ready(function($) {
    // let myCollection;

    ymaps.ready(init);

    function init() {
        let myCollection = new ymaps.GeoObjectCollection();
        let myPlacemark = [];
        myMap = new ymaps.Map('map', {
            center: [55.76, 37.64], // Москва
            zoom: 10
        }, {
            pointControlProvider: 'yandex#point'
        });

        allMapPoints(myCollection, myPlacemark);
        myMap.geoObjects.add(myCollection);

        $('#filter').keyup(function() {

            myCollection.removeAll();
            let regAddress = new RegExp($(this).val(), 'i');
            let flag = false;
            $('.point-l li').hide().removeClass('mapPoint');
            $('.point-l li .point-address').filter(function() {
                return regAddress.test($(this).text().replace(/[^\wа-яё]+/gi, ''));
            }).parent('li').show().addClass('mapPoint');
            allMapPoints(myCollection, myPlacemark);
            myMap.geoObjects.add(myCollection);
        })

        $('.point-i').click(function(e) {
            e.stopImmediatePropagation();
            $(this).addClass('itemActive');
            $('.point-i').not('.itemActive').hide();
            $(this).children('.point-metro').hide();
            $(this).children('.point-info').hide();
            let a = document.createElement('a');
            let filter = document.getElementById('filter');
            a.innerHTML = 'Все пункты выдачи';
            a.className = 'point-return';
            filter.after(a);
            $('body').one('click', '.point-return', function(e) {
                e.stopImmediatePropagation();
                $('.point-i').removeClass('itemActive');
                $('.point-i').not('.itemActive').show();
                $('.point-i').children('.point-metro').show();
            	$('.point-i').children('.point-info').show();
                a.remove();
                $('#filter').val('');
                $('.point-l li').addClass('mapPoint');
                myPlacemark = [];
                allMapPoints(myCollection, myPlacemark);
                myMap.geoObjects.add(myCollection);
                myMap.setCenter([55.76, 37.64], 10);

            });
            let selectAdd = $(this).children('.point-address').html();
            let selectCoord;
            ymaps.geocode(`г. Москва ${selectAdd}`).then(function(res) {
                selectCoord = res.geoObjects.get(0).geometry.getCoordinates();
                myMap.setCenter(selectCoord, 20);
                let listAdd = document.querySelectorAll('.point-address');
                for (var i = 0; i <= listAdd.length; i++) {
                    if (arraysEqual(myPlacemark[i].geometry.getCoordinates(), selectCoord)) {
                        myPlacemark[i].balloon.open();
                    }
                }
            })

        })
    }

    function arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;
        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    function mapPoint(listAdd, i, myCollection, myPlacemark) {
        ymaps.geocode(`г. Москва ${listAdd[i].innerHTML}`).then(function(res) {
            let coord = res.geoObjects.get(0).geometry.getCoordinates();
            let namePoint = listAdd[i].parentNode.querySelector('.point-name');
            let infoPoint = listAdd[i].parentNode.querySelector('.point-info');
            myPlacemark[i] = new ymaps.Placemark(coord, {
                balloonContentBody: `<span class="balloon-point-address">${listAdd[i].innerHTML}</span>`,
                balloonContentFooter: `<span class="balloon-point-name">${namePoint.innerHTML}</span> ${infoPoint.innerHTML}`,
            }, {
                iconLayout: 'default#image',
                iconImageHref: 'img/map.png',
                iconImageSize: [30, 30],
                iconImageOffset: [-15, -44],
            });

            if ($(listAdd[i]).parent('.point-i').hasClass('mapPoint')) {
                myCollection.add(myPlacemark[i]);
            }

        })
    }

    function allMapPoints(myCollection, myPlacemark) {
        let listAdd = document.querySelectorAll('.point-address');
        for (let i = 0; i < listAdd.length; i++) {
            mapPoint(listAdd, i, myCollection, myPlacemark);
        }

    }

})