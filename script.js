let recognition = null;

// 音声認識の初期化
function initSpeechRecognition() {
  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'ja-JP';
  }
}

// データの保存
function saveData() {
  const itemList = document.getElementById('itemList');
  const items = [];
  
  // リストのアイテムを配列に変換
  itemList.querySelectorAll('li').forEach(li => {
    const category = li.querySelector('.category-label').textContent;
    const name = li.querySelector('.item-name').textContent;
    const image = li.querySelector('img');
    items.push({
      category,
      name,
      image: image ? image.src : null
    });
  });
  
  // データをlocalStorageに保存
  localStorage.setItem('shoppingList', JSON.stringify(items));
}

// データの読み込み
function loadData() {
  const savedData = localStorage.getItem('shoppingList');
  if (savedData) {
    const items = JSON.parse(savedData);
    const itemList = document.getElementById('itemList');
    
    items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="category-label">${item.category}</span>
        <span class="item-name">${item.name}</span>
        <button onclick="removeItem(this)">×</button>
      `;
      
      if (item.image) {
        const img = document.createElement('img');
        img.src = item.image;
        li.insertBefore(img, li.firstChild);
      }
      
      itemList.appendChild(li);
    });
  }
}

// 音声入力の開始
function startVoiceInput() {
  if (!recognition) {
    initSpeechRecognition();
  }
  
  if (recognition) {
    recognition.start();
    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      document.getElementById('itemInput').value = transcript;
    };
  } else {
    alert('このブラウザでは音声認識機能が利用できません');
  }
}

// アイテムの追加
function addItem() {
  const category = document.getElementById('category').value;
  const itemName = document.getElementById('itemInput').value;
  const imageInput = document.getElementById('imageInput');
  const itemList = document.getElementById('itemList');

  if (!itemName) {
    alert('商品名を入力してください');
    return;
  }

  const li = document.createElement('li');
  li.innerHTML = `
    <span class="category-label">${category}</span>
    <span class="item-name">${itemName}</span>
    <button onclick="removeItem(this)">×</button>
  `;

  // 画像が選択されている場合、プレビューを表示
  if (imageInput.files.length > 0) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(imageInput.files[0]);
    li.insertBefore(img, li.firstChild);
  }

  itemList.appendChild(li);
  
  // データを保存
  saveData();
  
  // 入力フィールドをクリア
  document.getElementById('itemInput').value = '';
  imageInput.value = '';
}

// アイテムの削除
function removeItem(button) {
  const li = button.parentElement;
  li.remove();
  saveData();
}

// ページ読み込み時にデータを読み込み
window.onload = () => {
  loadData();
  initSpeechRecognition();
};
