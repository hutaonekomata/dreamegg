
const canvas = document.getElementById("renderCanvas");

        const startRenderLoop = function (engine, canvas) {
            engine.runRenderLoop(function () {
                if (sceneToRender && sceneToRender.activeCamera) {
                    sceneToRender.render();
                }
            });
        }

        function setModelColor(color) {
            if (selectedSettingsIndex !== null) {
                const model = models[selectedSettingsIndex - 1];
                model.material = new BABYLON.StandardMaterial("material", scenes[selectedSettingsIndex - 1]);
                model.material.diffuseColor = BABYLON.Color3.FromHexString(color);
            }
        }

        var engine = null;
        var scene = null;
        var sceneToRender = null;
        const createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };


        const createScene = async function () {

            const scene = new BABYLON.Scene(engine);

            // シーンの背景を透明にする（CSSを適用している為）
            scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

            // カメラを生成する
            const camera = new BABYLON.ArcRotateCamera('camera', Math.PI /0.98, Math.PI /-1.4, Math.PI /1, BABYLON.Vector3.Zero(), scene);

            // 生成したカメラをcanvasに接続
            camera.attachControl(canvas, true);

            //カメラのオート調整機能を適用する
            camera.useFramingBehavior = true;
            camera.framingBehavior.radiusScale = 0.8;

            //照明の設定
            //半球ライトを生成
            const light1 = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);
            light1.diffuse = new BABYLON.Color3(1, 1, 1);
            light1.groundColor = new BABYLON.Color3(50 / 255, 50 / 255, 50 / 255);

            light1.intensity = 1; //照明の強さ

            //3Dモデル（.gltf）を読み込む
            const res = await BABYLON.SceneLoader.ImportMeshAsync("", "./model/", "Hamburg.gltf", scene);
            //色を変える
            res.meshes[1].material.albedoColor = new BABYLON.Color3.FromHexString("#c1b2e1");

            //子メッシュの収容先を作っておく
            let parent = new BABYLON.Mesh("parent", scene);
            //_root_nodeを取得する
            const rootMesh = res.meshes[0];
            //rootMeshの要素に、各種の処理を適用する
            rootMesh.getChildMeshes(false).forEach(node => {
                node.enableEdgesRendering(Math.cos((30 / 180) * Math.PI));//メッシュに輪郭線を描画する
                node.edgesWidth = 10;//線の太さを指定
                node.edgesColor = new BABYLON.Color4(0, 0, 0, 1); //線の色を指定
                node.setParent(parent); //子メッシュの収容先（ "parent" ）を指定する
            });

            //parentに収納したメッシュ一覧を取得する
            let childMeshes = parent.getChildMeshes();

            //子メッシュ全体の境界点を取得する準備
            // 処理方法は、以下のbabylonjsのドキュメントを参照しました。
            // https://doc.babylonjs.com/features/featuresDeepDive/mesh/displayBoundingBoxes
            let min = childMeshes[0].getBoundingInfo().boundingBox.minimumWorld;
            let max = childMeshes[0].getBoundingInfo().boundingBox.maximumWorld;

            for (let i = 0; i < childMeshes.length; i++) {
                let meshMin = childMeshes[i].getBoundingInfo().boundingBox.minimumWorld;
                let meshMax = childMeshes[i].getBoundingInfo().boundingBox.maximumWorld;

                min = BABYLON.Vector3.Minimize(min, meshMin);
                max = BABYLON.Vector3.Maximize(max, meshMax);
            }
            //メッシュ全体の境界点を取得し、更新する
            parent.setBoundingInfo(new BABYLON.BoundingInfo(min, max));

            //本体を回転させる。3Dモデルの向きに問題なければ、このコードは不要
            parent.rotation = new BABYLON.Vector3((270 / 180) * Math.PI, (270 / 180) * Math.PI, 0);

            //カメラの照準をセット
            camera.setTarget(parent, true);

            //PANすると回転中心が狂う（settargetが書き換わる）ので、pan禁止にする
            camera.panningSensibility = 0;
            //境界の枠を出す。必要であればtrue
            parent.showBoundingBox = false;

            //読み込み時のホームポジションを記憶する
            camera.storeState();
            //勝手に角度が戻らないようにする
            camera.framingBehavior.elevationReturnTime = -1;

            //操作パネル部
            const home = document.getElementById("home");
            home.addEventListener("click", () => {
                camera.restoreState();
            });

            const top = document.getElementById("top");
            top.addEventListener("click", () => {
                    camera.alpha = Math.PI / 2;
                    camera.beta = 0;
            });

            const right = document.getElementById("right");
            right.addEventListener("click", () => {
                    camera.alpha = Math.PI;
                    camera.beta = Math.PI / 2;
            });

            const left = document.getElementById("left");
            left.addEventListener("click", () => {
                    camera.alpha = 0;
                    camera.beta = Math.PI / 2;
            });

            const bottom = document.getElementById("bottom");
            bottom.addEventListener("click", () => {
                    camera.alpha = Math.PI / 2;
                    camera.beta = Math.PI;
            });

            return scene;
        };
        window.initFunction = async function () {

            const asyncEngineCreation = async function () {
                try {
                    return createDefaultEngine();
                } catch (e) {
                    console.log("the available createEngine function failed. Creating the default engine instead");
                    return createDefaultEngine();
                }
            }

            window.engine = await asyncEngineCreation();
            if (!engine) throw 'engine should not be null.';
            startRenderLoop(engine, canvas);
            window.scene = createScene();
        };
        initFunction().then(() => {
            scene.then(returnedScene => { sceneToRender = returnedScene; });

        });

        // Resize
        window.addEventListener("resize", function () {
            engine.resize();
        });
  
        /*function main() {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas);
    // ここから
    function createScene() {
      // シーンを作成
      const scene = new BABYLON.Scene(engine);
      // カメラを作成
      //0.5=見る初期位置角度　5=カメラの引き具合
      const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 5, 5, new BABYLON.Vector3(0, 0, 0), scene);
      // カメラがユーザからの入力で動くように
      camera.attachControl(canvas, true);
      // ライトを作成
      //x横,y縦,z奥行 各座標からの光の量
      const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(5, 10, 0), scene);
      // 箱 (豆腐) を作成
      const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
      return scene;
    }
    
    const scene = createScene();
    
    engine.runRenderLoop(() => {
      scene.render();
    });
    
    window.addEventListener('resize', () => {
      engine.resize();
    });
  }
  window.addEventListener('DOMContentLoaded', main);*/

  /*var createScene = function () {
    const scene = new BABYLON.Scene(engine);
    // カメラを作成(カメラの向き、ズームを設定)
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 5, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    // ライトを作成(ライトの向きを設定)
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    const ground = BABYLON.MeshBuilder.CreateGround("ground", {
        width: 10,
        height: 10,
    });

    const grassMaterial = new BABYLON.StandardMaterial("grassMat");
    const grassTexture = new BABYLON.GrassProceduralTexture("grassTex", 256);
    grassMaterial.ambientTexture = grassTexture;
    ground.material = grassMaterial;

    // 輪郭の座標を配列に入れる
    const pointsL = [
        new BABYLON.Vector3(0, 0, 0),
        new BABYLON.Vector3(0, 0, 0.48),
        new BABYLON.Vector3(0.1, 0, 0.6),
        new BABYLON.Vector3(0.1, 0, 0.19),
        new BABYLON.Vector3(0.17, 0, 0.19),
        new BABYLON.Vector3(0.17, 0, 0),
    ];
    // メッシュを作成
    const logoL = BABYLON.MeshBuilder.ExtrudePolygon("logoL", {
        shape: pointsL,
        // 厚み
        depth: 0.2,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
    });

    const pointsR = [
        new BABYLON.Vector3(0.1, 0, 0.6),
        new BABYLON.Vector3(0.1, 0, 0.72),
        new BABYLON.Vector3(0.28, 0, 0.94),
        new BABYLON.Vector3(0.28, 0, 0.19),
        new BABYLON.Vector3(0.17, 0, 0.19),
        new BABYLON.Vector3(0.17, 0, 0.69),
    ];
    const logoR = BABYLON.MeshBuilder.ExtrudePolygon("logoR", {
        shape: pointsR,
        depth: 0.2,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
    });

    // マージ
    const logo = BABYLON.Mesh.MergeMeshes(
        [logoL, logoR],
        true,
        false,
        null,
        false,
        true
    );

    const logoMat = new BABYLON.StandardMaterial("logoMat");
    logoMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
    logo.material = logoMat;

    // y軸方向に回転して縦にする
    logo.rotation = new BABYLON.Vector3(-Math.PI / 2, 0, 0);
    //  浮かせる
    logo.position.y = 0.6;

    return scene;
};*/
/*var canvas = document.getElementById("renderCanvas");

var engine = new BABYLON.Engine(canvas, true);

var createScene = () => {
  var scene = new BABYLON.Scene(engine);

  var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI/2, Math.PI/4, 5, new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);

  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.diffuse = new BABYLON.Color3(1, 1, 1);

  // materials
  var white = new BABYLON.StandardMaterial("white", scene);
  white.diffuseColor = new BABYLON.Color3(1, 1, 1);

  var red = new BABYLON.StandardMaterial("red", scene);
  red.diffuseColor = new BABYLON.Color3(1, 0, 0);

  var green = new BABYLON.StandardMaterial("green", scene);
  green.diffuseColor = new BABYLON.Color3(0, 1, 0);

  // boxes
  var whiteBox = BABYLON.MeshBuilder.CreateBox("whiteBox", {size:1}, scene);
  whiteBox.position.x = -2;
  whiteBox.material = white;

  var redBox = BABYLON.MeshBuilder.CreateBox("redBox", {size:1}, scene);
  redBox.position.x = 0;
  redBox.material = red;

  var greenBox = BABYLON.MeshBuilder.CreateBox("greenBox", {size:1}, scene);
  greenBox.position.x = 2;
  greenBox.material = green;

  return scene;
};

var scene = createScene();

engine.runRenderLoop(() => scene.render());

window.addEventListener("resize", () => engine.resize());


/*今日できたもの　6/10
var createScene = function () {
    const scene = new BABYLON.Scene(engine);
    // カメラを作成(カメラの向き、ズームを設定)
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 5, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);
    // ライトを作成(ライトの向きを設定)
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    const ground = BABYLON.MeshBuilder.CreateGround("ground", {
        width: 10,
        height: 10,
    });

    const grassMaterial = new BABYLON.StandardMaterial("grassMat");
    const grassTexture = new BABYLON.GrassProceduralTexture("grassTex", 256);
    grassMaterial.ambientTexture = grassTexture;
    ground.material = grassMaterial;

    // 輪郭の座標を配列に入れる
    const pointsL = [
        new BABYLON.Vector3(1, 0, 0),
        new BABYLON.Vector3(0.5, 0, 0.86),
        new BABYLON.Vector3(-0.5, 0, 0.86),
        new BABYLON.Vector3(-1, 0, 0),
        new BABYLON.Vector3(-0.5, 0,-0.86),
        new BABYLON.Vector3(0.5, 0, -0.86),
    ];
    // メッシュを作成
    const logoL = BABYLON.MeshBuilder.ExtrudePolygon("logoL", {
        shape: pointsL,
        // 厚み
        depth: 0.2,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
    });

   

    // マージ
    const logo = BABYLON.Mesh.MergeMeshes(
      [logoL/*, logoR],
      true,
      false,
      null,
      false,
      true
  );

  const logoMat = new BABYLON.StandardMaterial("logoMat");
  logoMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
  logo.material = logoMat;

  // y軸方向に回転して縦にする
  //logo.rotation = new BABYLON.Vector3(-Math.PI / 2, 0, 0);
  //  浮かせる
  logo.position.y = 0.6;

  return scene;
};/:
*/
