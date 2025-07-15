const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let originalImage = new Image();
let imageFile;

imageInput.addEventListener('change', function () {
  imageFile = this.files[0];

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      originalImage.onload = function () {
        // عرض معلومات الصورة
        document.getElementById('imageName').textContent = imageFile.name;
        document.getElementById('imageSize').textContent = (imageFile.size / 1024).toFixed(2) + ' KB';
        document.getElementById('originalDimensions').textContent = `${originalImage.width} x ${originalImage.height}`;

        document.getElementById('widthInput').value = originalImage.width;
        document.getElementById('heightInput').value = originalImage.height;

        // عرض الصورة على الكانفاس
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        ctx.drawImage(originalImage, 0, 0);

        // إظهار الأقسام
        document.getElementById('info').classList.remove('hidden');
        document.getElementById('resizeSection').classList.remove('hidden');
        canvas.classList.remove('hidden');
      };

      originalImage.src = e.target.result;
    };

    reader.readAsDataURL(imageFile);
  }
});

function resizeImage() {
  const width = parseInt(document.getElementById('widthInput').value);
  const height = parseInt(document.getElementById('heightInput').value);

  if (width > 0 && height > 0) {
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(originalImage, 0, 0, width, height);
  }
}
