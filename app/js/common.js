$(function() {
    $('.mobile-menu-button').after('<div class="mobile-menu d-lg-none">');
    $('.main-menu').clone().appendTo('.mobile-menu');
    $('.mobile-menu-button').click(
        function() {
            $('.mobile-menu').stop().slideToggle();
        });
    var $data = {};
    var selected = false;
    var formError = false;
    $('.form-button').click(function() {
        event.preventDefault();
        var selectbox = $('#form').find('select');
        for (var i = 0; i < selectbox.length; i++) {
            if (selectbox[i].value == '') {
                selected = false;
                formError = true;
                checkSelect();
                continue;
            } else {
                selected = true;
            }
        }
        if (selected) {
            $('#form').find('input, textearea, select').each(function() {
                $data[this.name] = $(this).val() || null;
            });
            sendForm($data);
            // console.log('$data', $data);
            $('#form').find('select').each(function() {
                selectbox.prop('selectedIndex', 0);
            });
            formData.set();
        } else {
            try {
                checkAllForm();
            } catch (e) {
                alert('данные формы заполнены не полностью!');
            }
            alert('Выберите тип устройства и бренд!');
        }
    });

    sendForm = function(dataFile) {
        $.ajax({
            type: "POST",
            url: "mail.php",
            data: dataFile
        }).done(function() {
            alert("Спасибо за заявку! Скоро мы с вами свяжемся.");
            $('.spinner').hide();
        }).fail(function() {
            alert("Данные не отправлены!");
            $('.spinner').hide();
        });
        $('.spinner').show();
    };


    $('.owl-carousel').owlCarousel({
        items: 1,
        loop: true,
        // center: true,
        touchDrag: true,
        mouseDrag: true,
        nav: true,
        autoplay: false,
        autoplayTimeout: 2500,
        smartSpeed: 500,
        // dots: true,
        // dotsEach: true
        navText: ['<i class="icon-left-open-big" aria-hidden="true"></i>',
            '<i class="icon-right-open-big" aria-hidden="true"></i>'
        ],
        responsive: {
            320: {
                autoplay: false
            },
            992: {
                autoplay: false
            }
        }
    });
    var s = this;
    s.topLink = $('.topLink');
    s.showHideTopLink = function() {
        $(window).scrollTop() > 300 ?
            s.topLink.fadeIn(800) :
            s.topLink.fadeOut();
    };
    s.slowScroll = function(event) {
        /**
         * *ссылка кнопка submit
         */
        event.preventDefault();
        $('html, body')
            .stop()
            .animate({
                scrollTop: 0
            }, 1200);
    };
    $(window).scroll(s.showHideTopLink);
    s.topLink.click(s.slowScroll);
    var formData = {
        set: function() {
            var myForm = [];
            localStorage.removeItem('myForm');
            $('#form').find('input, select').each(function() {
                myForm.push({
                    name: this.name,
                    value: this.value
                });
            });
            localStorage.myForm = JSON.stringify(myForm);
        },
        get: function() {
            if (localStorage.myForm != undefined) {
                myForm = JSON.parse(localStorage.myForm);
                for (var i = 0; i < myForm.length; i++) {
                    $('[name=' + myForm[i].name + ']').val(myForm[i].value);
                }
            }
        }
    };
    formData.get();
    $('input, select').change(function() {
        formData.set();
    });
    checkValidName = function() {
        var idObj = this;
        var ele = $('#' + idObj.id);
        if (ele.val().length < 6) {
            isValidFalse(ele);
        } else {
            isValidTrue(ele);
        }
    };
    checkValidPhone = function() {
        var patt = /^(\+38)(\([0-9]{3}\))([ ])([0-9]{3})([-])([0-9]{4})$/;
        var idObj = this;
        var ele = $('#' + idObj.id);
        var test = ele.val();
        if (!test.match(patt)) {
            isValidFalse(ele);
        } else {
            isValidTrue(ele);
        }
    };
    checkValidEmail = function() {
        var patt = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var idObj = this;
        var ele = $('#' + idObj.id);
        if (!patt.test(ele.val())) {
            isValidFalse(ele);
        } else {
            isValidTrue(ele);
        }
    };
    checkValidCity = function() {
        var patt = /^[A-Za-zА-Яа-я]+$/;
        var idObj = this;
        var ele = $('#' + idObj.id);
        if (!patt.test(ele.val())) {
            isValidFalse(ele);
        } else {
            isValidTrue(ele);
        }
    };

    checkSelect = function() {
        $('#form').find('select').each(function() {
            if ($(this).val() == '') {
                $(this).css({
                    border: '1px solid red'
                });
            }
        });
    };

    isValidTrue = function(element) {
        element.css({
            'box-shadow': 'inset 0 3px 0 green'
        });
    };
    isValidFalse = function(element) {
        element.css({
            'box-shadow': 'inset 0 3px 0 red'
        });
    };
    checkAllForm = function() {
        if (formError) {
            checkValidName();
            checkValidCity();
            checkValidEmail();
            checkValidPhone();
        } else {
            return true;
        }
    };
    var Settings = {};
    Settings.data = {};
    Settings.init = function(oSettings) {
        Settings.data = oSettings;
    };
    Settings.get = function(sSettingName) {
        return Settings.data[sSettingName];
    };
    Settings.init(jsonFormat);
    var brand = Settings.get('brand');
    initJson = function(name) {
        var $problem = $('#problem');
        $problem.find('option').remove();
        var selectOption = Settings.get(name);
        $.each(selectOption, function(key, value) {
            if (key == 'problem_witch') {
                $problem.append('<option  hidden value=' + key + '>' + value + '</option>');
            } else {
                $problem.append('<option value=' + key + '>' + value + '</option>');
            }
        });
    };
    initJson('problem');
    getProblem = function() {
        var selected = $(this).val();
        initBrand(selected);
    };
    initBrand = function(name) {
        var $brand = $('#brand');
        $brand.find('option').remove();
        $brand.append('<option value="" hidden>Brand</option>');
        $.each(brand[name], function(key, value) {
            $brand.append('<option value=' + key + '>' + value + '</option>');
        });
    };
    $('#formName').inputmask('Aaa{6,20}', {
        placeholder: ''
    });
    $('#city').inputmask('Aaa{3,20}');
    $('#email').inputmask({
        mask: '*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]',
        greedy: false,
        onBeforePaste: function(pastedValue, opts) {
            pastedValue = pastedValue.toLowerCase();
            return pastedValue.replace('mailto:', '');
        },
        definitions: {
            '*': {
                validator: '[0-9A-Za-z!#$%&\'*+/=?^_`{|}~\-]',
                casing: 'lower'
            }
        },
        clearMaskOnLostFocus: true
    });
    $('#daytime').inputmask('+38(999) 999-9999');
    $('#formName').change(checkValidName);
    $('#daytime').change(checkValidPhone);
    $('#email').change(checkValidEmail);
    $('#city').change(checkValidCity);
    $('#problem').change(getProblem);
    $('img, a').on('dragstart', function(event) {
        event.preventDefault();
    });

});