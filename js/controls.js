import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

export class Controls {
  constructor(camera, renderer, scene) {
    this.camera = camera;
    this.renderer = renderer;
    this.scene = scene;
    this.orbitControls = null;
    this.controllers = [];
    this.controllerGrips = [];
    this.raycaster = new THREE.Raycaster();
    this.tempMatrix = new THREE.Matrix4();
    this.intersected = [];
    
    this.setupOrbitControls();
    this.setupXRControls();
  }
  
  setupOrbitControls() {
    // 创建轨道控制器（非VR模式下使用）
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitControls.target.set(0, 1.6, 0);
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.05;
    this.orbitControls.screenSpacePanning = false;
    this.orbitControls.minDistance = 1;
    this.orbitControls.maxDistance = 10;
    this.orbitControls.maxPolarAngle = Math.PI / 2;
  }
  
  setupXRControls() {
    // 创建XR控制器
    const controllerModelFactory = new XRControllerModelFactory();
    
    // 控制器0
    const controller1 = this.renderer.xr.getController(0);
    controller1.addEventListener('selectstart', this.onSelectStart.bind(this));
    controller1.addEventListener('selectend', this.onSelectEnd.bind(this));
    this.scene.add(controller1);
    
    const controllerGrip1 = this.renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    this.scene.add(controllerGrip1);
    
    // 控制器1
    const controller2 = this.renderer.xr.getController(1);
    controller2.addEventListener('selectstart', this.onSelectStart.bind(this));
    controller2.addEventListener('selectend', this.onSelectEnd.bind(this));
    this.scene.add(controller2);
    
    const controllerGrip2 = this.renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    this.scene.add(controllerGrip2);
    
    // 为控制器添加视觉指示器
    const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)]);
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2
    });
    
    const line = new THREE.Line(geometry, material);
    line.scale.z = 5;
    
    controller1.add(line.clone());
    controller2.add(line.clone());
    
    this.controllers.push(controller1, controller2);
    this.controllerGrips.push(controllerGrip1, controllerGrip2);
  }
  
  onSelectStart(event) {
    const controller = event.target;
    
    // 射线检测
    this.tempMatrix.identity().extractRotation(controller.matrixWorld);
    this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);
    
    return controller;
  }
  
  onSelectEnd(event) {
    const controller = event.target;
    return controller;
  }
  
  update(artworks) {
    // 更新轨道控制器
    if (this.orbitControls) {
      this.orbitControls.update();
    }
    
    // 更新XR控制器
    for (let i = 0; i < this.controllers.length; i++) {
      const controller = this.controllers[i];
      
      // 射线检测
      this.tempMatrix.identity().extractRotation(controller.matrixWorld);
      this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
      this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);
      
      // 检测与艺术品的交互
      const intersects = [];
      
      if (artworks && artworks.length > 0) {
        artworks.forEach(artwork => {
          if (artwork.artwork) {
            const intersect = this.raycaster.intersectObject(artwork.artwork);
            if (intersect.length > 0) {
              intersects.push({
                object: artwork,
                distance: intersect[0].distance
              });
            }
          }
        });
      }
      
      if (intersects.length > 0) {
        // 按距离排序
        intersects.sort((a, b) => a.distance - b.distance);
        
        // 高亮最近的艺术品
        if (this.intersected[i] !== intersects[0].object) {
          if (this.intersected[i]) {
            this.intersected[i].deselect();
          }
          
          this.intersected[i] = intersects[0].object;
          this.intersected[i].select();
        }
      } else {
        // 取消高亮
        if (this.intersected[i]) {
          this.intersected[i].deselect();
          this.intersected[i] = null;
        }
      }
    }
  }
}