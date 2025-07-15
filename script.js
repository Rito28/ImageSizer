// DOM Elements
const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');
const resizeBtn = document.getElementById('resizeBtn');
const uploadLabel = document.getElementById('uploadLabel');
const fileUpload = document.querySelector('.file-upload');

let originalImage = new Image();
let imageFile;

// Image upload handling
imageInput.addEventListener('change', function() {
  handleImageUpload(this.files[0]);
});

// Resize button event
resizeBtn.addEventListener('click', resizeImage);

// Download button event
downloadBtn.addEventListener('click', downloadImage);

// Drag and drop events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  fileUpload.addEventListener(eventName, preventDefaults, false);
});

['dragenter', 'dragover'].forEach(eventName => {
  fileUpload.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  fileUpload.addEventListener(eventName, unhighlight, false);
});

fileUpload.addEventListener('drop', function(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  if (files.length) {
    handleImageUpload(files[0]);
  }
});

function handleImageUpload(file) {
  imageFile = file;
  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function(e) {
      originalImage.onload = function() {
        updateImageInfo();
        setInitialDimensions();
        displayImageOnCanvas();
        showSections();
      };
      originalImage.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  }
}

function updateImageInfo() {
  document.getElementById('imageName').textContent = imageFile.name;
  const sizeInKB = (imageFile.size / 1024).toFixed(2);
  document.getElementById('imageSize').textContent = `${sizeInKB} كيلوبايت`;
  document.getElementById('originalDimensions').textContent = 
    `${originalImage.width} × ${originalImage.height} بكسل`;
}

function setInitialDimensions() {
  document.getElementById('widthInput').value = originalImage.width;
  document.getElementById('heightInput').value = originalImage.height;
}

function displayImageOnCanvas() {
  canvas.width = originalImage.width;
  canvas.height = originalImage.height;
  ctx.drawImage(originalImage, 0, 0);
}

function showSections() {
  document.getElementById('info').classList.remove('hidden');
  document.getElementById('resizeSection').classList.remove('hidden');
  canvas.classList.remove('hidden');
  downloadBtn.classList.remove('hidden');
}

function resizeImage() {
  const width = parseInt(document.getElementById('widthInput').value);
  const height = parseInt(document.getElementById('heightInput').value);

  if (width > 0 && height > 0) {
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(originalImage, 0, 0, width, height);
    showMessage('تم تعديل حجم الصورة بنجاح!', 'success');
  } else {
    showMessage('الرجاء إدخال أبعاد صحيحة', 'error');
  }
}

function downloadImage() {
  const link = document.createElement('a');
  link.download = `resized_${imageFile.name}`;
  link.href = canvas.toDataURL('image/jpeg', 0.9);
  link.click();
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight() {
  fileUpload.classList.add('highlight');
}

function unhighlight() {
  fileUpload.classList.remove('highlight');
}

function showMessage(message, type) {
  const messageEl = document.createElement('div');
  messageEl.textContent = message;
  messageEl.style.position = 'fixed';
  messageEl.style.bottom = '20px';
  messageEl.style.left = '50%';
  messageEl.style.transform = 'translateX(-50%)';
  messageEl.style.padding = '10px 20px';
  messageEl.style.borderRadius = 'var(--border-radius)';
  messageEl.style.backgroundColor = type === 'success' ? '#4BB543' : '#FF3333';
  messageEl.style.color = 'white';
  messageEl.style.boxShadow = 'var(--box-shadow)';
  messageEl.style.zIndex = '1000';
  messageEl.style.transition = 'var(--transition)';
  
  document.body.appendChild(messageEl);
  
  setTimeout(() => {
    messageEl.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(messageEl);
    }, 300);
  }, 3000);
}