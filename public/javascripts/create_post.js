const dropArea = document.getElementById('drop-area');
const inputFile = document.getElementById('input-file');
const imgPrev = document.getElementById('img-view');
const submbtn = document.getElementById('submbtn');

inputFile.addEventListener('change', uploadImage);

function uploadImage() {
    var uploadFile = inputFile.files[0];
    if (!(/\.(gif|jpg|jpeg|tiff|png)$/i).test(uploadFile.name)) {
        alert("Please upload an image file");
        return;
    }

    let imgUrl = URL.createObjectURL(uploadFile);
    // console.log(imgUrl);
    imgPrev.style.backgroundImage = `url(${imgUrl})`;
    imgPrev.textContent = "";
    imgPrev.style.border = 0;
    imgPrev.style.backgroundColor = "#fff";
    submbtn.style.cursor="pointer";
}

//drag-drop feature

dropArea.addEventListener('dragover', function (e) {
    e.preventDefault();
});

dropArea.addEventListener('drop', function (e) {
    e.preventDefault();

    inputFile.files = e.dataTransfer.files;
    uploadImage();
});

