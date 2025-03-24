import * as THREE from 'three';

export class Gallery {
  constructor(scene) {
    this.scene = scene;
    this.galleryGroup = new THREE.Group();
    this.scene.add(this.galleryGroup);
    
    // 画廊尺寸
    this.size = {
      width: 10,
      height: 4,
      depth: 10
    };
    
    // 创建画廊结构
    this.createFloor();
    this.createWalls();
    this.createCeiling();
    this.createExterior();
    this.createLights();
    
    // 创建展示位置
    this.artworkPositions = this.createArtworkPositions();
  }
  
  createFloor() {
    const floorGeometry = new THREE.PlaneGeometry(this.size.width, this.size.depth);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8f8f8, // 极简白色地板
      roughness: 0.1,  // 更光滑的表面
      metalness: 0.05  // 轻微金属感
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    this.galleryGroup.add(floor);
    
    // 添加反光效果
    const reflectionGeometry = new THREE.PlaneGeometry(this.size.width, this.size.depth);
    const reflectionMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.05,
      metalness: 0.1,
      transparent: true,
      opacity: 0.2
    });
    const reflection = new THREE.Mesh(reflectionGeometry, reflectionMaterial);
    reflection.rotation.x = -Math.PI / 2;
    reflection.position.y = 0.01; // 略高于地板
    this.galleryGroup.add(reflection);
  }
  
  createWalls() {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff, // 纯白墙壁
      roughness: 0.05, // 更光滑的表面
      metalness: 0.0   // 无金属感
    });
    
    // 北墙
    const northWallGeometry = new THREE.PlaneGeometry(this.size.width, this.size.height);
    const northWall = new THREE.Mesh(northWallGeometry, wallMaterial);
    northWall.position.z = -this.size.depth / 2;
    northWall.position.y = this.size.height / 2;
    northWall.receiveShadow = true;
    this.galleryGroup.add(northWall);
    
    // 南墙
    const southWallGeometry = new THREE.PlaneGeometry(this.size.width, this.size.height);
    const southWall = new THREE.Mesh(southWallGeometry, wallMaterial);
    southWall.position.z = this.size.depth / 2;
    southWall.position.y = this.size.height / 2;
    southWall.rotation.y = Math.PI;
    southWall.receiveShadow = true;
    this.galleryGroup.add(southWall);
    
    // 东墙
    const eastWallGeometry = new THREE.PlaneGeometry(this.size.depth, this.size.height);
    const eastWall = new THREE.Mesh(eastWallGeometry, wallMaterial);
    eastWall.position.x = this.size.width / 2;
    eastWall.position.y = this.size.height / 2;
    eastWall.rotation.y = -Math.PI / 2;
    eastWall.receiveShadow = true;
    this.galleryGroup.add(eastWall);
    
    // 西墙
    const westWallGeometry = new THREE.PlaneGeometry(this.size.depth, this.size.height);
    const westWall = new THREE.Mesh(westWallGeometry, wallMaterial);
    westWall.position.x = -this.size.width / 2;
    westWall.position.y = this.size.height / 2;
    westWall.rotation.y = Math.PI / 2;
    westWall.receiveShadow = true;
    this.galleryGroup.add(westWall);
  }
  
  createCeiling() {
    const ceilingGeometry = new THREE.PlaneGeometry(this.size.width, this.size.depth);
    const ceilingMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff, // 纯白天花板
      roughness: 0.05, // 更光滑的表面
      metalness: 0.0   // 无金属感
    });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = this.size.height;
    ceiling.receiveShadow = true;
    this.galleryGroup.add(ceiling);
  }
  
  createExterior() {
    // 创建外部环境（极简风格天空盒）
    const skyColor = new THREE.Color(0x000000); // 黑色背景，突出艺术品
    this.scene.background = skyColor;
    
    // 创建简单的地面
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111, // 深灰色地面
      roughness: 0.1,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }
  
  createLights() {
    // 环境光 - 柔和的基础照明
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);
    
    // 画廊内部的聚光灯 - 现代博物馆风格定向照明
    const spotLightCount = 8; // 增加灯光数量以获得更均匀的照明
    const spotLightIntensity = 0.6; // 降低单个灯光强度
    const spotLightDistance = 20; // 增加照射距离
    
    for (let i = 0; i < spotLightCount; i++) {
      const angle = (i / spotLightCount) * Math.PI * 2;
      const x = (this.size.width / 3) * Math.cos(angle);
      const z = (this.size.depth / 3) * Math.sin(angle);
      
      const spotLight = new THREE.SpotLight(0xffffff, spotLightIntensity, spotLightDistance, Math.PI / 8, 0.8, 1.5);
      spotLight.position.set(x, this.size.height - 0.2, z);
      spotLight.castShadow = true;
      spotLight.shadow.mapSize.width = 2048; // 提高阴影质量
      spotLight.shadow.mapSize.height = 2048;
      
      // 将聚光灯指向画廊中心
      spotLight.target.position.set(0, this.size.height / 2, 0);
      this.scene.add(spotLight.target);
      this.scene.add(spotLight);
    }
    
    // 为每幅艺术品添加专门的照明
    const artPositions = this.createArtworkPositions();
    artPositions.forEach(pos => {
      // 计算灯光位置 - 位于艺术品上方
      const lightX = pos.x;
      const lightY = this.size.height - 0.5;
      const lightZ = pos.z;
      
      // 创建定向光源
      const artLight = new THREE.DirectionalLight(0xffffff, 0.8);
      artLight.position.set(lightX, lightY, lightZ);
      
      // 计算目标位置 - 艺术品中心
      const targetX = pos.x;
      const targetY = pos.y;
      const targetZ = pos.z;
      
      artLight.target.position.set(targetX, targetY, targetZ);
      this.scene.add(artLight.target);
      this.scene.add(artLight);
    });
  }
  
  createArtworkPositions() {
    // 创建艺术品展示位置
    const positions = [];
    const wallOffset = 0.05; // 与墙壁的距离
    const spacing = 2.2; // 艺术品之间的间距
    const heightFromGround = 1.5; // 艺术品中心距离地面的高度
    
    // 北墙艺术品位置
    const northWallCount = Math.floor(this.size.width / spacing) - 1;
    const northWallStart = -(northWallCount - 1) * spacing / 2;
    
    for (let i = 0; i < northWallCount; i++) {
      positions.push({
        x: northWallStart + i * spacing,
        y: heightFromGround,
        z: -this.size.depth / 2 + wallOffset,
        rotationY: 0,
        normalAngle: Math.PI
      });
    }
    
    // 南墙艺术品位置
    const southWallCount = Math.floor(this.size.width / spacing) - 1;
    const southWallStart = -(southWallCount - 1) * spacing / 2;
    
    for (let i = 0; i < southWallCount; i++) {
      positions.push({
        x: southWallStart + i * spacing,
        y: heightFromGround,
        z: this.size.depth / 2 - wallOffset,
        rotationY: Math.PI,
        normalAngle: 0
      });
    }
    
    // 东墙艺术品位置
    const eastWallCount = Math.floor(this.size.depth / spacing) - 1;
    const eastWallStart = -(eastWallCount - 1) * spacing / 2;
    
    for (let i = 0; i < eastWallCount; i++) {
      positions.push({
        x: this.size.width / 2 - wallOffset,
        y: heightFromGround,
        z: eastWallStart + i * spacing,
        rotationY: -Math.PI / 2,
        normalAngle: Math.PI / 2
      });
    }
    
    // 西墙艺术品位置
    const westWallCount = Math.floor(this.size.depth / spacing) - 1;
    const westWallStart = -(westWallCount - 1) * spacing / 2;
    
    for (let i = 0; i < westWallCount; i++) {
      positions.push({
        x: -this.size.width / 2 + wallOffset,
        y: heightFromGround,
        z: westWallStart + i * spacing,
        rotationY: Math.PI / 2,
        normalAngle: -Math.PI / 2
      });
    }
    
    return positions;
  }
}