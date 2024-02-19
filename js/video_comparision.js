// Written by Dor Verbin, October 2021
// This is based on: http://thenewcode.com/364/Interactive-Before-and-After-Video-Comparison-in-HTML5-Canvas
// With additional modifications based on: https://jsfiddle.net/7sk5k4gp/13/

function playVids(videoId, text) {
    var videoMerge = document.getElementById(videoId + "Merge");
    var vid = document.getElementById(videoId);

    var position = 0.5;
    var vidWidth = vid.videoWidth/2;
    var vidHeight = vid.videoHeight;

    var mergeContext = videoMerge.getContext("2d");


    if (vid.readyState > 3) {
        vid.play();

        function trackLocation(e) {
            // Normalize to [0, 1]
            bcr = videoMerge.getBoundingClientRect();
            position = ((e.pageX - bcr.x) / bcr.width);
        }
        function trackLocationTouch(e) {
            // Normalize to [0, 1]
            bcr = videoMerge.getBoundingClientRect();
            position = ((e.touches[0].pageX - bcr.x) / bcr.width);
        }

        videoMerge.addEventListener("mousemove",  trackLocation, false);
        videoMerge.addEventListener("touchstart", trackLocationTouch, false);
        videoMerge.addEventListener("touchmove",  trackLocationTouch, false);


        function drawLoop() {
            mergeContext.drawImage(vid, 0, 0, vidWidth, vidHeight, 0, 0, vidWidth, vidHeight);
            var colStart = (vidWidth * position).clamp(0.0, vidWidth);
            var colWidth = (vidWidth - (vidWidth * position)).clamp(0.0, vidWidth);
            mergeContext.drawImage(vid, colStart+vidWidth, 0, colWidth, vidHeight, colStart, 0, colWidth, vidHeight);
            requestAnimationFrame(drawLoop);

            var arrowPosY = vidHeight * 0.85;
            var arrowWidth = 0.007 * vidHeight;
            var currX = vidWidth * position;

            // Draw border
            mergeContext.beginPath();
            mergeContext.moveTo(vidWidth*position, 0);
            mergeContext.lineTo(vidWidth*position, vidHeight);
            mergeContext.closePath()
            mergeContext.strokeStyle = "#FFFFFF";
            mergeContext.lineWidth = 20;
            mergeContext.stroke();

            // Draw sequence name
            mergeContext.beginPath();
            mergeContext.font = "80px Arial";
            mergeContext.fillStyle = "#FFFFFF";
            // center text
            var textWidth = mergeContext.measureText(text).width;
            mergeContext.fillText(text, vidWidth/2 - textWidth/2, vidHeight * 0.1);
            


            // Draw text
            mergeContext.beginPath();
            mergeContext.moveTo(currX, arrowPosY - arrowWidth/2);
            mergeContext.font = "80px Arial";
            mergeContext.fillStyle = "#FFFFFF";
            mergeContext.fillText("HEVC", currX - 285, arrowPosY);
            mergeContext.fillText("HEVC + NeonCue", currX + 70, arrowPosY)
        }
        requestAnimationFrame(drawLoop);
    }
}

Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};


function resizeAndPlay(element, text)
{
    var cv = document.getElementById(element.id + "Merge");
    cv.width = element.videoWidth/2;
    cv.height = element.videoHeight;
    element.play();
    element.style.height = "0px";  // Hide video without stopping it

    playVids(element.id, text);
}

// document.querySelector('video').defaultPlaybackRate = 5.0;
// document.querySelector('video').play();
