//Must have this to apply tinymce to textareas
tinymce.init({
    selector: '#tmcetextarea',
    width: 1080,
    min_width: 700,
    min_height: 400,
    resize: 'both',
    branding: false,
    menubar: false,
    plugins: 
        [
            'advlist autolink link lists image charmap print preview anchor textcolor powerpaste',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table contextmenu code help'
        ],
    toolbar: 'insert | undo redo | styleselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
    powerpaste_word_import: 'merge'
});