import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { CKEditorComponent, CKEditor5 } from '@ckeditor/ckeditor5-angular';
import '@ckeditor/ckeditor5-build-classic/build/translations/it';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { ToastrService } from 'ngx-toastr';

var $: JQueryStatic = require('jquery');

function customButton(context) {
    const ui = ($ as any).summernote.ui;
    const button = ui.button({
        contents: '<i class="note-icon-magic"></i> Hello',
        tooltip: 'Custom button',
        container: '.note-editor',
        className: 'note-btn',
        click: function () {
            context.invoke('editor.insertText', 'Hello from test btn!!!');
        }
    });
    return button.render();
}

@Component({
    selector: 'mailing',
    template: require('./mailing.component.html'),
    styles: [require('./mailing.component.scss')]
})

export class MailingComponent implements OnInit {
    title: string = 'Mailing';
    isBusy: Subscription;
    isLoading: boolean = false;
    form: FormGroup;


    // BEGIN ngx-summernote config (https://summernote.org/deep-dive/)
    ngxsummernoteconfig: any = {
        airmode: false,
        tabdisable: true,
        popover: {
            table: [
                ['add', ['addrowdown', 'addrowup', 'addcolleft', 'addcolright']],
                ['delete', ['deleterow', 'deletecol', 'deletetable']],
            ],
            image: [
                ['image', ['resizefull', 'resizehalf', 'resizequarter', 'resizenone']],
                ['float', ['floatleft', 'floatright', 'floatnone']],
                ['remove', ['removemedia']]
            ],
            link: [
                ['link', ['linkdialogshow', 'unlink']]
            ],
            air: [
                [
                    'font',
                    [
                        'bold',
                        'italic',
                        'underline',
                        'strikethrough',
                        'superscript',
                        'subscript',
                        'clear'
                    ]
                ],
            ]
        },
        height: '200px',
        uploadimagepath: '/api/upload',
        toolbar: [
            ['misc', ['codeview', 'undo', 'redo', 'codeblock']],
            [
                'font',
                [
                    'bold',
                    'italic',
                    'underline',
                    'strikethrough',
                    'superscript',
                    'subscript',
                    'clear'
                ]
            ],
            ['fontsize', ['fontname', 'fontsize', 'color']],
            ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
            ['insert', ['table', 'picture', 'link', 'video', 'hr']],
            ['custombuttons', ['testbtn']]
        ],
        buttons: {
            testbtn: customButton
        },
        codeviewfilter: true,
        codeviewfilterregex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml|.*onmouseover)[^>]*?>/gi,
        codeviewiframefilter: true
    };
    // END ngx-summernote config

    constructor(private toastrService: ToastrService, private formBuilder: FormBuilder) { }

    public ngOnInit(): void {
        this.initForm();
    }

    public ngAfterViewInit(): void {
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            text: ['', [Validators.required]]
        });

        this.form.valueChanges
            .subscribe(data => setTimeout(() => this.onValueChanged(data)));

        this.onValueChanged(); // (re)set validation messages now
    }

    onValueChanged(data?: any): void {
        if (!this.form) { return; }
        const form = this.form;

        for (const field in this.formErrors) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get(field);

            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += (messages[key] || '') + ' ';
                }
            }
        }
    }

    formErrors: { [key: string]: string } = {
        'text': ''
    };

    validationMessages: { [key: string]: { [key: string]: string } }  = {
        'text': {
            'required': 'Questo campo e\' obbligatorio.'
        }
    };
}