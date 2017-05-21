//-*- coding: utf-8 -*-

openerp.attachment_dragdrop = function(instance) {
    var internal = {
        drag_and_drop_init: false,
        form_selector: '.o_sidebar_add_attachment form.o_form_binary_form',
        form_selector_odoo8: '.oe_sidebar_add_attachment form.oe_form_binary_form',

    };

    instance.web.Sidebar.include({
        start: function (parent) {
            var self = this;
            this._super.apply(this, arguments);
            if (internal.drag_and_drop_init === true) {
                return;
            }

            var main = document.querySelector('body > .o_main'); // Odoo 10
            if (null === main) {
                main = document.querySelector('body > .openerp_webclient_container'); // Odoo 8
                if (null === main) {
                    return;
                }
                internal.form_selector = internal.form_selector_odoo8;
            }

            var counter_drag_enter = 0;
            document.addEventListener('dragenter', function (event) {
                event.preventDefault();
                if (null === document.querySelector(internal.form_selector)) {
                    return;
                }

                counter_drag_enter++;
                main.classList.add('dragover');
                main.setAttribute('data-dragover-text', openerp._t('Drop files here to add it'));
            }, false);
            document.addEventListener('dragleave', function (event) {
                event.preventDefault();
                if (null === document.querySelector(internal.form_selector)) {
                    return;
                }

                counter_drag_enter--;
                if (0 === counter_drag_enter) {
                    main.classList.remove('dragover');
                }
            }, false);

            main.addEventListener('dragover', function (event) {
                event.stopPropagation();
                event.preventDefault();
                event.dataTransfer.dropEffect = 'copy';
            }, false);

            main.addEventListener('drop', function (event) {
                event.stopPropagation();
                event.preventDefault();

                counter_drag_enter = 0;
                main.classList.remove('dragover');

                self.ondrop(event);
            }, false);

            internal.drag_and_drop_init = true;
        },
        ondrop: function (event) {
             var form_upload = document.querySelector(internal.form_selector);

             if (null === form_upload) {
                 return;
             }

             var form_data = new FormData(form_upload);
             for (var iterator = 0, file; file = event.dataTransfer.files[iterator]; iterator++) {
                 form_data.set('ufile', file);
                 $.ajax({
                     url: form_upload.getAttribute('action'),
                     method: form_upload.getAttribute('method'),
                     type: form_upload.getAttribute('method'),
                     processData: false,
                     contentType: false,
                     data: form_data,
                     success: function (data) {
                         $('body').append(data);
                     },
                     error: function (jqXHR, textStatus, errorThrown) {
                         console.error(jqXHR, textStatus, errorThrown);
                     }
                 });
             }
        }
    });
}
