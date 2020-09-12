var clientX
var clientY
var dragging = false

class Draggable { 
    dragging = false

    measuresConversionTable = {
        'px': m=>m,
        '%': (m, parentM) => {
            return parentM*(m/100)
        },
        'vh': m => Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) * m,
        'vw': m => Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) * m,
    }

    constructor(styles, dragScope=document.body, tagname='div') {
        this.dragScope = dragScope

        this.convertMeasuresToPx('5%', this.dragScope.getBoundingClientRect().height)

        this.createNode(styles, tagname)
        this.appendElementToDragScope()
        this.registerEventListeners()
    }
    
    createNode(styles, tagname) {
        this.node = document.createElement(tagname)
        
        
        for (const k in styles) {
            if (styles.hasOwnProperty(k)) {
                this.node.style[k] = styles[k]
            }
        }

        let dragScopeRect = this.dragScope.getBoundingClientRect()

        this.node.style.top = `${Math.min(dragScopeRect.bottom - this.node.style.height.replace(/[^0-9]/g, '') , Math.max( parseInt(this.node.style.top.replace('px', '')) || 0, dragScopeRect.top ))}px`
        this.node.style.left = `${Math.min(dragScopeRect.right - this.node.style.width.replace(/[^0-9]/g, '') , Math.max( parseInt(this.node.style.left.replace('px', '')) || 0, dragScopeRect.left ))}px`

        console.log(this.node.style)
    }

    appendElementToDragScope() {
        this.dragScope.appendChild(this.node)
    }

    dragEngine = function*() {
        while(true) {
            //passa o controle pro event loop esperando a proxima chamada
            yield
            //checa se o elemento está sendo arrastado
            if(this.dragging) {
                //move o centro do elemento para posição
                this.move()
            }
        }
    }

    move() {
        // bottom: 267
        // left: 8
        // right: 728
        // top: 8

        // left = 
        let dragScopeRect = this.dragScope.getBoundingClientRect()

        this.node.style.left = `${Math.max(dragScopeRect.left, Math.min( this.clientX - (this.node.offsetWidth / 2), dragScopeRect.right - this.node.offsetWidth))}px`

        this.node.style.top = `${Math.max(dragScopeRect.top, Math.min( this.clientY - (this.node.offsetHeight / 2), dragScopeRect.bottom - this.node.offsetWidth))}px`
    }

    registerEventListeners() {
        // node listeners
        this.node.addEventListener('mousedown', e=>{ this.changeDragState(true) })
        document.body.addEventListener('mouseup', e=>{ this.changeDragState(false) })


        let engineGen = this.dragEngine()

        document.body.addEventListener('mousemove', e=>this.engineController(e, engineGen))
    }

    engineController(e, engineGen) {
        this.clientX = e.clientX
        this.clientY = e.clientY
        engineGen.next()
    }

    changeDragState(state) {
        this.dragging = state
    }

    convertMeasuresToPx(m, pxParentM) {
        let unit = m.match(/[^0-9.]/g).join('')
        let measure = parseFloat(m.match(/[0-9.]*/g).join(''))

        return this.measuresConversionTable[unit](measure, pxParentM)
    }
}

const colors = [
    '#FF0018',
    '#FFA52C',
    '#FFFF41',
    '#008018',
    '#0000F9',
    '#86007D',
]

document.addEventListener('DOMContentLoaded', () => {
    // let div = document.querySelector('div.draggable')
    
    // div.addEventListener('mouseup', e=>{ dragging = false })
    // div.addEventListener('mousedown', e=>{ dragging = true })
    // let dragCoroutine = drag(div)

    // document.body.addEventListener('mousemove', e=>dragControls(e, dragCoroutine))

    new Draggable({
        width: "100px",
        height: "100px",
        backgroundColor: colors[3],
        position: "absolute",
        top: '2000px'
    }, document.querySelector('div.scope'))   

    // for (let i = 0; i < 7; i++) {
    //     new Draggable({
    //         width: "100px",
    //         height: "100px",
    //         backgroundColor: colors[i],
    //         position: "absolute",
    //         top: `${i * 20}px`
    //     })     
    // }
})
