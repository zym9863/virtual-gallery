import * as THREE from 'three';

export class Artwork {
  constructor(scene, position, size = { width: 1.6, height: 1.2 }, imageUrl) {
    this.scene = scene;
    this.position = position;
    this.size = size;
    this.imageUrl = imageUrl;
    this.artwork = null;
    this.frame = null;
    this.info = null;
    this.isSelected = false;
    
    this.loadArtwork();
  }
  
  loadArtwork() {
    // 创建画框
    this.createFrame();
    
    // 加载图片纹理
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(this.imageUrl, (texture) => {
      // 调整画布大小以匹配图片比例
      const imageAspect = texture.image.width / texture.image.height;
      const canvasWidth = this.size.width - 0.1;
      const canvasHeight = canvasWidth / imageAspect;
      
      // 创建画布材质
      const canvasGeometry = new THREE.PlaneGeometry(canvasWidth, canvasHeight);
      const canvasMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
      });
      
      this.artwork = new THREE.Mesh(canvasGeometry, canvasMaterial);
      this.artwork.position.set(
        this.position.x,
        this.position.y,
        this.position.z
      );
      
      // 设置旋转
      this.artwork.rotation.y = this.position.rotationY;
      
      // 根据墙壁位置微调
      if (this.position.normalAngle !== undefined) {
        const offset = 0.05; // 与墙壁的距离
        const normalVector = new THREE.Vector3(
          Math.cos(this.position.normalAngle),
          0,
          Math.sin(this.position.normalAngle)
        );
        
        this.artwork.position.x += normalVector.x * offset;
        this.artwork.position.z += normalVector.z * offset;
      }
      
      this.scene.add(this.artwork);
      
      // 调整画框大小以匹配画布
      this.updateFrameSize(canvasWidth, canvasHeight);
    });
  }
  
  createFrame() {
    // 创建极简风格画框
    const frameWidth = this.size.width;
    const frameHeight = this.size.height;
    const frameDepth = 0.02; // 更薄的画框
    const frameBorderWidth = 0.03; // 更窄的边框
    
    // 创建画框组
    this.frame = new THREE.Group();
    
    // 画框材质 - 极简黑色
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000, // 纯黑色
      roughness: 0.05, // 光滑表面
      metalness: 0.1   // 轻微金属感
    });
    
    // 创建四个边框
    // 上边框
    const topFrameGeometry = new THREE.BoxGeometry(frameWidth, frameBorderWidth, frameDepth);
    const topFrame = new THREE.Mesh(topFrameGeometry, frameMaterial);
    topFrame.position.y = frameHeight / 2 - frameBorderWidth / 2;
    this.frame.add(topFrame);
    
    // 下边框
    const bottomFrameGeometry = new THREE.BoxGeometry(frameWidth, frameBorderWidth, frameDepth);
    const bottomFrame = new THREE.Mesh(bottomFrameGeometry, frameMaterial);
    bottomFrame.position.y = -frameHeight / 2 + frameBorderWidth / 2;
    this.frame.add(bottomFrame);
    
    // 左边框
    const leftFrameGeometry = new THREE.BoxGeometry(frameBorderWidth, frameHeight - 2 * frameBorderWidth, frameDepth);
    const leftFrame = new THREE.Mesh(leftFrameGeometry, frameMaterial);
    leftFrame.position.x = -frameWidth / 2 + frameBorderWidth / 2;
    this.frame.add(leftFrame);
    
    // 右边框
    const rightFrameGeometry = new THREE.BoxGeometry(frameBorderWidth, frameHeight - 2 * frameBorderWidth, frameDepth);
    const rightFrame = new THREE.Mesh(rightFrameGeometry, frameMaterial);
    rightFrame.position.x = frameWidth / 2 - frameBorderWidth / 2;
    this.frame.add(rightFrame);
    
    // 设置画框位置
    this.frame.position.set(
      this.position.x,
      this.position.y,
      this.position.z
    );
    
    // 设置旋转
    this.frame.rotation.y = this.position.rotationY;
    
    // 根据墙壁位置微调
    if (this.position.normalAngle !== undefined) {
      const offset = 0.05; // 与墙壁的距离
      const normalVector = new THREE.Vector3(
        Math.cos(this.position.normalAngle),
        0,
        Math.sin(this.position.normalAngle)
      );
      
      this.frame.position.x += normalVector.x * offset;
      this.frame.position.z += normalVector.z * offset;
    }
    
    this.scene.add(this.frame);
  }
  
  updateFrameSize(width, height) {
    if (this.frame) {
      // 移除旧的画框
      this.scene.remove(this.frame);
      
      // 更新尺寸
      this.size.width = width + 0.1;
      this.size.height = height + 0.1;
      
      // 重新创建画框
      this.createFrame();
    }
  }
  
  createInfoPanel(title, artist, year, description) {
    // 创建信息面板（当用户选择艺术品时显示）
    this.info = {
      title,
      artist,
      year,
      description
    };
  }
  
  select() {
    this.isSelected = true;
    // 高亮显示选中的艺术品 - 更加微妙的高亮效果
    if (this.frame) {
      // 为画框添加发光效果
      this.frame.traverse((child) => {
        if (child.isMesh) {
          // 使用白色发光效果，更符合现代艺术馆风格
          child.material.emissive = new THREE.Color(0xffffff);
          child.material.emissiveIntensity = 0.5;
        }
      });
    }
    
    // 为画作添加轻微放大效果
    if (this.artwork) {
      // 保存原始比例
      this.originalScale = this.artwork.scale.clone();
      // 轻微放大
      this.artwork.scale.multiplyScalar(1.05);
    }
    
    return this.info;
  }
  
  deselect() {
    this.isSelected = false;
    // 取消高亮
    if (this.frame) {
      this.frame.traverse((child) => {
        if (child.isMesh) {
          child.material.emissive = new THREE.Color(0x000000);
          child.material.emissiveIntensity = 0;
        }
      });
    }
    
    // 恢复原始大小
    if (this.artwork && this.originalScale) {
      this.artwork.scale.copy(this.originalScale);
    }
  }
}