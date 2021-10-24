const canvas = document.getElementById("canvas");
const input_image = document.getElementById("input_image");
const pre_div = document.getElementsByClassName("pre_div");
const pre_elem = document.getElementById("ascii_output");
const output_div = document.getElementById("output_div");
const output_type_ascii = document.getElementById("output_type_ascii");
const output_type_image = document.getElementById("output_type_image");
const output_dim = document.getElementById("output_dim");
const output_dim_span = document.getElementById("range_val");
const context = canvas.getContext("2d");
//const asciis = "@$&%#0oa{}[]()\\/|?!i<>+~-*\"^;:'.` ";
const asciis = "@$#o()\\/|!:'.`";

const getFontRatio = () => {
    const pre = document.createElement("pre");
    pre.style.display = "inline";
    pre.textContent = " ";
  
    document.body.appendChild(pre);
    const { width, height } = pre.getBoundingClientRect();
    document.body.removeChild(pre);
  
    return height/width;
};

function show_range()
{
    output_dim_span.innerHTML = " "+output_dim.value;
}
  
const fontRatio = getFontRatio();

input_image.onchange = e => {

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = event => {

        const image = new Image();

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
        };

        image.src = event.target.result;

    };

    reader.readAsDataURL(file);

};

const to_grayscale = (r, g, b) => 0.21 * r + 0.72 * g + 0.07 * b;
const to_ascii = (grayscale_value, n) => Math.ceil((n-1)*grayscale_value/255);

function convert()
{
    pre_elem.setAttribute("style", "display: block");
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

    pre_elem.textContent = text;

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
        });
    }
}