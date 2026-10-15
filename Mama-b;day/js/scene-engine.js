/**
 * Scene Engine
 * Manages cinematic scene mount, transitions, life-cycle callbacks,
 * and automatic cinematic pacing.
 */
export class SceneEngine {
  constructor({ root, onSceneChange }) {
    this.root = root;
    this.onSceneChange = onSceneChange || (() => {});
    this.index = -1;
    this.scenes = [];
    this.stage = null;
    this.isTransitioning = false;
  }

  mount(sceneBuilders, autoActivate = false) {
    this.root.innerHTML = "";
    this.stage = document.createElement("main");
    this.stage.className = "stage";
    this.stage.setAttribute("role", "region");
    this.stage.setAttribute("aria-label", "Cinematic Scene Stage");

    this.scenes = [];
    sceneBuilders.forEach((builder, i) => {
      const sceneNode = builder();
      sceneNode.classList.add("scene", "behind");
      sceneNode.setAttribute("aria-hidden", "true");
      sceneNode.dataset.sceneIndex = String(i);
      this.stage.appendChild(sceneNode);
      this.scenes.push(sceneNode);
    });

    this.root.appendChild(this.stage);
    if (autoActivate) {
      this.goTo(0, false);
    }
  }

  goTo(targetIndex, announce = true) {
    if (targetIndex < 0 || targetIndex >= this.scenes.length) return false;

    const prevIndex = this.index;
    this.index = targetIndex;

    this.scenes.forEach((scene, i) => {
      if (i === targetIndex) {
        scene.classList.add("active");
        scene.classList.remove("exit", "behind");
        scene.removeAttribute("aria-hidden");
      } else if (i < targetIndex) {
        scene.classList.remove("active");
        scene.classList.add("exit");
        scene.setAttribute("aria-hidden", "true");
      } else {
        scene.classList.remove("active", "exit");
        scene.classList.add("behind");
        scene.setAttribute("aria-hidden", "true");
      }
    });

    setTimeout(() => {
      this.isTransitioning = false;
    }, 700);

    if (announce) {
      this.onSceneChange(this.index, prevIndex);
    }
    return true;
  }

  next() {
    return this.goTo(this.index + 1);
  }

  previous() {
    return this.goTo(this.index - 1);
  }

  getCurrentScene() {
    return this.scenes[this.index] || null;
  }
}
