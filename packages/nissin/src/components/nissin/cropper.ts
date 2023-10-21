import { fabric } from 'fabric';


const ImageCropper = function(canvasEL:HTMLCanvasElement, blob:Blob, contrainerSize = 500, options = {scale:1}, ) {

    this.scale = options.scale ? options.scale * 100 : 150;
    this.blob = blob;

    this.canvas = canvasEL; 
    this.fObj;
    this.size;

    this.maxZoomIn;
    this.maxZoomOut;

    this.currentTool = "move"
    
    this.currentTransform = [0,0];

    this.allElement;
    this.containerEl
    this.upperCanvasEl
    this.bottomCanvasEl

    this.wrapperEl;


    this.selecteBoxs = [];

    // move 
    this.moving = false;

    this.init = async() => {
        await this.loadImg();
        
        this.containerEl = document.querySelector('.canvas-container') as HTMLCanvasElement;
        this.upperCanvasEl = document.querySelector('.upper-canvas') as HTMLCanvasElement;
        this.bottomCanvasEl = document.querySelector('.lower-canvas') as HTMLCanvasElement ;
        this.wrapperEl = document.getElementById('cropperContainer')
        this.allElement = [
            this.containerEl,
            this.upperCanvasEl,
            this.bottomCanvasEl
        ]

        // add listener
        this.wrapperEl.addEventListener('mousedown', this.mouseDown );
        this.wrapperEl.addEventListener('mouseup', this.mouseUp );
        this.wrapperEl.addEventListener('mouseleave', this.mouseUp );
        this.wrapperEl.addEventListener('mousemove', this.mouseMove );
        this.wrapperEl.addEventListener('wheel', this.scrollHandler);

        this.scaleCanvas();
    }
    this.renderPicture = async(blob) => {
        try{

       
        const originalBmp = await createImageBitmap(this.blob);
        const { width, height } = originalBmp;
        this.size = [width, height];
        this.canvas.width = width;
        this.canvas.height = height;
        this.fObj = new fabric.Canvas(this.canvas,{
            selection:false
        });
        const path = window.URL.createObjectURL(blob);
        this.fObj.setBackgroundImage(path,
            this.fObj.renderAll.bind(this.fObj)
        )
        // calculate init scale
        if(width >= height) {
            this.scale = contrainerSize / width;
        } else {
            this.scale = contrainerSize / height;
        }
        this.maxZoomOut = this.scale;
        this.maxZoomIn = this.scale * 10;
        originalBmp.close();
        } catch(err) {
            console.log(err)
        }
    }
    this.renderPdf = async(blob) => {
        const path = window.URL.createObjectURL(blob);
        // @ts-ignore
        const pdf = await pdfjsLib.getDocument(path).promise
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        this.canvas.height = viewport.height;
        this.canvas.width = viewport.width;
        this.size = [viewport.width, viewport.height];
        const context = this.canvas.getContext('2d');

        const renderContext = {
            canvasContext: context,
            viewport,
        };
        await page.render(renderContext);
        const background = this.canvas.toDataURL('image/png');
        this.fObj = new fabric.Canvas(this.canvas,{
            selection:false
        });
        this.fObj.setBackgroundImage(background,
            this.fObj.renderAll.bind(this.fObj)
        )
        // calculate init scale
        if(viewport.width >= viewport.height) {
            this.scale = contrainerSize / viewport.width;
        } else {
            this.scale = contrainerSize / viewport.height;
        }
        this.maxZoomOut = this.scale;
        this.maxZoomIn = this.scale * 10;
    }
    this.loadImg = async () => {
        // check img mintype
        const { type } = this.blob;
        try {
            
            if ( type.includes('image')) {
                await this.renderPicture(this.blob);
                return;
            }
            console.log(type.includes('pdf'))
            if(type.includes('pdf')) {
                await this.renderPdf(this.blob);
            }
        } catch (error) {
            console.log(error)
        }

        

        //setup element;
    }

    this.changeTool = (tool:string) => {
        this.currentTool = tool;
        // toggle select tool 
        this.fObj.selection = tool === 'select';
        // switch tool to set listener
    }

    this.zoomIn = (amount:number = 0.01) => {
        this.scale = this.clampZoom(this.scale + amount);
        this.scaleCanvas();
    }

    this.zoomOut = (amount:number = 0.01) => {
        this.scale = this.clampZoom(this.scale - amount);
        this.scaleCanvas();
    }

    

    this.scaleCanvas = () => {
        this.wrapperEl.style.setProperty('--scale', this.scale);
    }

    this.move = ({x,y}) => {
        this.currentTransform[0] += x;
        this.currentTransform[1] += y;
        this.wrapperEl.style.setProperty('--translate', `${this.currentTransform[0]}px, ${this.currentTransform[1]}px`);
    }

    this.createSquare = ({mouseX, mouseY}) => {
        const left = mouseX + this.upperCanvasEl.getBoundingClientRect().left  + this.currentTransform[0];
        const top = mouseY + this.upperCanvasEl.getBoundingClientRect().top + this.currentTransform[1];
        const width = 600;
        const toolObj = new fabric.Rect({
            left,
            top,
            width,
            height: width,
            fill: 'rgba(0,0,0,0.1)',
            stroke: 'red',
            strokeSize: 30,
            cornerSize: 50,
        });
        this.fObj.setActiveObject(toolObj);
        this.fObj.add(toolObj);
        // setup dropdown
        this.selecteBoxs.push(toolObj) ;
        this.changeTool("select");

    }

    this.mouseDown = (ev) => {
        this.moving = true;
        if(this.currentTool === 'draw') {
            const {clientX, clientY} = ev;
            this.createSquare({mouseX:clientX, mouseY:clientY});
            return

        }
    }

    this.mouseMove = (ev) => {
        if(!this.moving) return;
        const {movementX, movementY} = ev;
        if(this.currentTool === 'move') {
            this.move({x:movementX,y:movementY });
            return
        }
        if(this.currentTool === 'draw') {
            //
        }
        
    }

    this.mouseUp = (ev) => {
        this.moving = false;
    }

    this.scrollHandler = (ev) => {
        this.scale = this.clampZoom(this.scale - ev.deltaY / 1000 );
        this.scaleCanvas();
        
        // TODO : update transform to match center;'const {pageX,pageY} = ev
        
    }


    // init loading
    this.init();


    // utils
    this.clampZoom = (scale:number) => Math.min(Math.max(scale, this.maxZoomOut), this.maxZoomIn);



}

export default ImageCropper;