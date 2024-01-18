let imgInp= document.getElementById('file-input');
let blah= document.getElementById('profile-img');

imgInp.onchange = evt => {
    const [file] = imgInp.files
    if (file) {
        blah.src = URL.createObjectURL(file);
    }
}