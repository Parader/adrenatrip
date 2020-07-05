import React from "react"
import Gsap from "gsap"
import TweenOne from "rc-tween-one"

class DepthImage extends React.Component {
  constructor(props) {
    super(props)

    this.container = React.createRef()
    this.scrollEvent = null
    this.state = { paused: true }

    this.canvas = null
  }

  componentDidMount() {
    const { image, depthmap, resize } = this.props
    const init = async () => {
      const ratio = window.innerWidth / window.innerHeight
      const shouldUseWidth = ratio > 1.5 || window.innerWidth > 1400
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      let width = shouldUseWidth ? windowWidth : windowHeight * 1.5
      let height = shouldUseWidth ? windowWidth / 1.5 : windowHeight * 1.2

      let img = new Image(width, height)
      img.srcSet = image.childImageSharp.fluid.srcSetWebp
      img.src = image.childImageSharp.fluid.originalImg
      await new Promise(r => {
        this.setState({ paused: false })
        return (img.onload = r)
      })

      let depth = new Image(width, height)

      depth.srcSet = depthmap.childImageSharp.fluid.srcSetWebp
      depth.src = depthmap.childImageSharp.fluid.originalImg
      await new Promise(r => (depth.onload = r))

      this.canvas = document.createElement("canvas")
      this.canvas.height = height
      this.canvas.width = width

      let gl = this.canvas.getContext("webgl")

      Object.assign(this.canvas.style, {
        minWidth: "100%",
        minHeight: "100%",
        objectFit: "contain",
        //  top: offset > window.innerHeight * 0.75 ? `-5vw` : "0",
      })

      this.container.current.appendChild(this.canvas)

      let buffer = gl.createBuffer()
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
      )

      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(0)

      let vshader = `
    attribute vec2 pos;
    varying vec2 vpos;
    void main(){
        vpos = pos*-0.5 + vec2(0.5);
        gl_Position = vec4(pos, 0.0, 1.0);
    }
    `
      let vs = gl.createShader(gl.VERTEX_SHADER)
      gl.shaderSource(vs, vshader)
      gl.compileShader(vs)

      let fshader = `
    precision highp float;
    uniform sampler2D img;
    uniform sampler2D depth;
    uniform vec2 mouse;
    varying vec2 vpos;
    void main(){
        float dp = -0.5 + texture2D(depth, vpos).x;
        gl_FragColor = texture2D(img, vpos + mouse * 0.2 * dp);
    }
    `
      let fs = gl.createShader(gl.FRAGMENT_SHADER)
      gl.shaderSource(fs, fshader)
      gl.compileShader(fs)

      let program = gl.createProgram()
      gl.attachShader(program, fs)
      gl.attachShader(program, vs)
      gl.linkProgram(program)
      gl.useProgram(program)

      function setTexture(im, name, num) {
        let texture = gl.createTexture()
        gl.activeTexture(gl.TEXTURE0 + num)
        gl.bindTexture(gl.TEXTURE_2D, texture)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im)
        gl.uniform1i(gl.getUniformLocation(program, name), num)
      }

      setTexture(img, "img", 0)
      setTexture(depth, "depth", 1)

      resize()
      let mouseLoc = gl.getUniformLocation(program, "mouse")
      let totalDisplacement = window.innerHeight * 0.7
      let currentPosition = -0.1
      let targetPosition = currentPosition
      let mpos = [0.0, currentPosition]
      const maxDisplacement = 0.5
      gl.uniform2fv(mouseLoc, new Float32Array(mpos))

      this.scrollEvent = e => {
        const percent =
          window.scrollY < totalDisplacement
            ? window.scrollY / totalDisplacement
            : 1
        const position = maxDisplacement * percent

        targetPosition = position
        Gsap.to(mpos, 0.6, {
          1: targetPosition,
        })
      }

      document.addEventListener("scroll", this.scrollEvent)

      const loop = () => {
        gl.clearColor(0.25, 0.65, 1, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        gl.uniform2fv(mouseLoc, new Float32Array(mpos))

        requestAnimationFrame(() => loop())
      }

      loop()
    }
    if (this.container.current) init()
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.scrollEvent)
  }

  render() {
    return (
      <>
        <TweenOne
          className="loading-overlay"
          animation={{ opacity: 0, delay: 150, duration: 300 }}
          paused={this.state.paused}
        ></TweenOne>
        <div className="depth-image" ref={this.container}></div>
      </>
    )
  }
}

export default DepthImage
