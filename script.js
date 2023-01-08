const video=document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),//for different parts of the face
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')//emotion
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia( //to use the pc webcam
      { video: {} },
      stream=>video.srcObject =stream,
      err=>console.log(err)
    
  )
}

video.addEventListener('play',()=>{
  // console.log("Video Started")
  const canvas=faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const dispSize={width:video.width,height:video.height}
  faceapi.matchDimensions(canvas,dispSize)
  setInterval(async()=>{
    const detections=await faceapi.detectAllFaces(video,new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    // console.log(detections)
    const resizedDetections=faceapi.resizeResults(detections,dispSize)
    canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  },100)
  })
