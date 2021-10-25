// --------- loading html elements ---------

const canvas = document.getElementById("canvas");
const image_input = document.getElementById("image_input");
const pre_elem = document.getElementById("ascii_output");
const output_div = document.getElementById("output_div");
const output_type_ascii = document.getElementById("output_type_ascii");
const output_type_image = document.getElementById("output_type_image");
const output_dim = document.getElementById("output_dim");
const output_dim_span = document.getElementById("output_dim_span");
const context = canvas.getContext("2d");

// --------- pixel to ascii mapping: [0, 255] => [@, `] --------- 

// const asciis = "@$&%#0oa{}[]()\\/|?!i<>+~-*\"^;:'.` ";
const asciis = "@$#o()\\/|!:'.`";

// --------- global variables --------- 

var file;
var output_canvas;
const reader = new FileReader();
const image = new Image();

// --------- event handlers ---------

// load image into a file after uploading it
image_input.onchange = e => {
    file = e.target.files[0];
}

// show range value when slider changes
output_dim.oninput = () => {
    output_dim_span.innerHTML = output_dim.value;
}

// on image loading, resize the image and load it into the canvas
// and then call convert
image.onload = () => {

    let height = image.height;
    let width = Math.floor(image.width*getFontRatio());

    let max_dim = output_dim.value;

    if(height>max_dim)
    {
        width =  Math.floor(width*max_dim/height);
        height = max_dim;
    }

    if(width>max_dim)
    {
        height = Math.floor(height*max_dim/width);
        width = max_dim;
    }

    canvas.height = height;
    canvas.width = width;

    context.drawImage(image, 0, 0, width, height);
    
    convert();
};

// set image source to the uploaded image after loading the image from the device
reader.onload = event => {
    image.src = event.target.result;
};

// --------- some helper functions ---------

// function to compute font ratio
const getFontRatio = () => {
    const pre = document.createElement("pre");
    pre.style.display = "inline";
    pre.textContent = " ";
  
    document.body.appendChild(pre);
    const { width, height } = pre.getBoundingClientRect();
    document.body.removeChild(pre);
  
    return height/width;
};

const to_grayscale = (r, g, b) => 0.21 * r + 0.72 * g + 0.07 * b;
const to_ascii = (grayscale_value, n) => Math.ceil((n-1)*grayscale_value/255);

function rescale(elem)
{
    var width = elem.offsetWidth;
    var height = elem.offsetHeight;
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var r = 1;
    r = Math.min(1, Math.min(windowWidth / width, windowHeight / height));

    elem.setAttribute("style", "display: flex; justify-content:center; zoom: "+r);
}

// --------- functions to download the converted image ---------

function saveText() 
{
    const blob = new Blob([pre_elem.innerHTML], {type:'text/plain'});
    const link = document.createElement("a");
    link.download = "image2ascii.txt";
    link.innerHTML = "Download File";
    link.href = window.URL.createObjectURL(blob);

    if (window.webkitURL == null) 
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        link.onclick = destroyClickedElement;
        link.style.display = "none";
        document.body.appendChild(link);
    }

    link.click();
}

function saveImage()
{
    const link = document.createElement("a");
    link.download = "image2ascii.png";
    link.innerHTML = "Download File";
    link.href = output_canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    
    if (window.webkitURL == null) 
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        link.onclick = destroyClickedElement;
        link.style.display = "none";
        document.body.appendChild(link);
    }

    link.click();
}

function download()
{
    if(document.querySelector('input[name = output_type]:checked').value=="ascii")
    {
        saveText();
    }
    else
    {
        saveImage();
    }
}

// --------- main function ---------

// function called after clicking the convert button
function init()
{
    // read file from the device
    reader.readAsDataURL(file);
}

function convert()
{
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const n = asciis.length;

    let i = 0;
    let text = "";
    for(let row=0; row<canvas.height; row++)
    {
        for(let col=0; col<canvas.width; col++)
        {
           text += asciis[to_ascii(to_grayscale(
                imageData.data[i], 
                imageData.data[i+1],
                imageData.data[i+2]
            ), n)];
            i += 4;
        }
        text += "\n";
    }

    pre_elem.setAttribute("style", "display: flex; justify-content:center;");
    pre_elem.textContent = text;
    rescale(pre_elem);

    output_div.innerHTML = "<p style=\"font-size: 20px; text-align:center;\">Converting... Please wait.</p>";

    if(document.querySelector('input[name = output_type]:checked').value=="ascii")
    {
        output_div.innerHTML = "<p style=\"font-size: 20px; text-align:center;\">All done. Copy and paste the text in a file.</p>"; 
    }

    else
    {
        html2canvas(document.getElementById("ascii_output")).then(function(image_output) {
            pre_elem.setAttribute("style", "display: none");
            output_div.innerHTML = "<p style=\"font-size: 20px; text-align:center;\">All done. Zoom out to see or Right click on the image to save it.</p>";
            output_div.appendChild(image_output);
            output_canvas = image_output;

            rescale(output_canvas);
        });
    }
}
