import * as THREE from 'three';
import { Gallery } from './gallery.js';
import { Artwork } from './artwork.js';
import { Controls } from './controls.js';

class VirtualGallery {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.loadingElement = document.getElementById('loading');
    this.infoElement = document.getElementById('info');
    this.vrButton = document.getElementById('vr-button');
    this.artworkInfoElement = document.getElementById('artwork-info');
    this.artworkTitleElement = document.getElementById('artwork-title');
    this.artworkArtistElement = document.getElementById('artwork-artist');
    this.artworkYearElement = document.getElementById('artwork-year');
    this.artworkDescriptionElement = document.getElementById('artwork-description');
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.gallery = null;
    this.controls = null;
    this.artworks = [];
    this.clock = new THREE.Clock();
    this.isVRMode = false;
    
    this.init();
  }
  
  init() {
    // 创建场景
    this.scene = new THREE.Scene();
    
    // 创建相机
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 1.6, 3);
    
    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    
    // 检查WebXR支持
    if ('xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        if (supported) {
          this.vrButton.style.display = 'block';
          this.vrButton.addEventListener('click', this.enterVR.bind(this));
          
          // 设置WebXR
          this.renderer.xr.enabled = true;
        }
      });
    }
    
    // 创建画廊
    this.gallery = new Gallery(this.scene);
    
    // 创建控制器
    this.controls = new Controls(this.camera, this.renderer, this.scene);
    
    // 加载艺术品
    this.loadArtworks();
    
    // 添加窗口调整事件监听
    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    // 添加键盘控制
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    
    // 添加鼠标点击事件
    this.canvas.addEventListener('click', this.onMouseClick.bind(this));
    
    // 开始动画循环
    this.renderer.setAnimationLoop(this.animate.bind(this));
    
    // 隐藏加载提示
    this.loadingElement.style.display = 'none';
  }
  
  loadArtworks() {
    // 艺术品数据
    const artworkData = [
      {
        title: '星夜',
        artist: '文森特·梵高',
        year: '1889',
        description: '这幅画描绘了圣雷米修道院外的夜景，是梵高最著名的作品之一。',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1200px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg'
      },
      {
        title: '蒙娜丽莎',
        artist: '列奥纳多·达·芬奇',
        year: '1503-1519',
        description: '这幅肖像画以其神秘的微笑和难以捉摸的表情而闻名于世。',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg'
      },
      {
        title: '呐喊',
        artist: '爱德华·蒙克',
        year: '1893',
        description: '这幅表现主义作品展现了一个扭曲的人物形象，表达了现代人的焦虑和绝望。',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/800px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg'
      },
      {
        title: '睡莲',
        artist: '克劳德·莫奈',
        year: '1916',
        description: '这是莫奈晚年创作的一系列睡莲画作之一，展现了他对光和色彩的独特理解。',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg/800px-Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg'
      },
      {
        title: '向日葵',
        artist: '文森特·梵高',
        year: '1888',
        description: '这幅静物画是梵高向日葵系列中的一幅，以其鲜艳的黄色和大胆的笔触著称。',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Vincent_Willem_van_Gogh_127.jpg/800px-Vincent_Willem_van_Gogh_127.jpg'
      },
      {
        title: '格尔尼卡',
        artist: '巴勃罗·毕加索',
        year: '1937',
        description: '这幅大型壁画描绘了西班牙内战中格尔尼卡镇被轰炸的恐怖，是20世纪最著名的反战艺术品之一。',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/7/74/PicassoGuernica.jpg'
      },
      {
        title: '持久的记忆',
        artist: '萨尔瓦多·达利',
        year: '1931',
        description: '这幅超现实主义作品以其融化的钟表和荒凉的风景而闻名，探讨了时间和记忆的概念。',
        imageUrl: 'https://uploads6.wikiart.org/images/salvador-dali/the-persistence-of-memory-1931.jpg'
      },
      {
        title: '夜间咖啡馆',
        artist: '文森特·梵高',
        year: '1888',
        description: '这幅作品描绘了阿尔勒的一家夜间咖啡馆，以其强烈的色彩对比和情感表达而著称。',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Vincent_Willem_van_Gogh_076.jpg/800px-Vincent_Willem_van_Gogh_076.jpg'
      }
    ];
    
    // 创建艺术品对象
    const positions = this.gallery.artworkPositions;
    
    for (let i = 0; i < Math.min(positions.length, artworkData.length); i++) {
      const data = artworkData[i];
      const artwork = new Artwork(this.scene, positions[i], undefined, data.imageUrl);
      artwork.createInfoPanel(data.title, data.artist, data.year, data.description);
      this.artworks.push(artwork);
    }
  }
  
  enterVR() {
    this.renderer.xr.getSession().then((session) => {
      this.isVRMode = true;
      session.addEventListener('end', () => {
        this.isVRMode = false;
      });
    });
  }
  
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  onKeyDown(event) {
    // 键盘控制移动
    const speed = 0.1;
    const cameraDirection = new THREE.Vector3();
    this.camera.getWorldDirection(cameraDirection);
    
    switch (event.key.toLowerCase()) {
      case 'w': // 前进
        this.camera.position.add(cameraDirection.multiplyScalar(speed));
        break;
      case 's': // 后退
        this.camera.position.sub(cameraDirection.normalize().multiplyScalar(speed));
        break;
      case 'a': // 左移
        this.camera.position.add(new THREE.Vector3(-cameraDirection.z, 0, cameraDirection.x).normalize().multiplyScalar(speed));
        break;
      case 'd': // 右移
        this.camera.position.add(new THREE.Vector3(cameraDirection.z, 0, -cameraDirection.x).normalize().multiplyScalar(speed));
        break;
    }
  }
  
  onMouseClick(event) {
    if (this.isVRMode) return; // VR模式下不处理鼠标点击
    
    // 添加鼠标点击视觉反馈
    const clickFeedback = document.createElement('div');
    clickFeedback.style.position = 'absolute';
    clickFeedback.style.width = '10px';
    clickFeedback.style.height = '10px';
    clickFeedback.style.borderRadius = '50%';
    clickFeedback.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    clickFeedback.style.left = `${event.clientX - 5}px`;
    clickFeedback.style.top = `${event.clientY - 5}px`;
    clickFeedback.style.pointerEvents = 'none';
    clickFeedback.style.transition = 'all 0.5s ease';
    clickFeedback.style.zIndex = '1000';
    document.body.appendChild(clickFeedback);
    
    // 动画效果
    setTimeout(() => {
      clickFeedback.style.transform = 'scale(3)';
      clickFeedback.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
      document.body.removeChild(clickFeedback);
    }, 500);
    
    // 计算鼠标位置
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // 射线检测
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    
    // 检测与艺术品的交互
    let selectedArtwork = null;
    let closestDistance = Infinity;
    
    this.artworks.forEach(artwork => {
      if (artwork.artwork) {
        const intersects = raycaster.intersectObject(artwork.artwork);
        if (intersects.length > 0 && intersects[0].distance < closestDistance) {
          selectedArtwork = artwork;
          closestDistance = intersects[0].distance;
        }
      }
    });
    
    // 处理选中的艺术品
    this.artworks.forEach(artwork => {
      if (artwork === selectedArtwork) {
        const info = artwork.select();
        if (info) {
          // 显示艺术品信息
          this.artworkTitleElement.textContent = info.title;
          this.artworkArtistElement.textContent = info.artist;
          this.artworkYearElement.textContent = info.year;
          this.artworkDescriptionElement.textContent = info.description;
          this.artworkInfoElement.style.display = 'block';
        }
      } else {
        artwork.deselect();
      }
    });
    
    // 如果没有选中任何艺术品，隐藏信息面板
    if (!selectedArtwork) {
      this.artworkInfoElement.style.display = 'none';
    }
  }
  
  animate() {
    // 更新控制器
    this.controls.update(this.artworks);
    
    // 渲染场景
    this.renderer.render(this.scene, this.camera);
  }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  new VirtualGallery();
});