![](https://github.com/harshapraneeth/image_to_ascii/blob/c8521717628c4945fd20d5e8f301e490b8119011/media/dua_comparison.jpg)

# Image to Ascii

**Introduction:** While browsing Instagram I came across this wonderful piece of art,

<img src="D:\t downloads\photo_2021-10-25_03-25-46.jpg" style="zoom:25%;" />

It got me thinking If I could do something like this, but not quite ambitious. That motivated me to do this. The goal is to convert each pixel of an image into an ASCII character. The result of this conversion should resemble the original image. Just like in the above picture.

**Approach: **

I searched online to find some existing work about this. Luckily I came across a well-detailed [blog post](https://marmelab.com/blog/2018/02/20/convert-image-to-ascii-art-masterpiece.html). The author left almost no stone unturned. I pretty much followed his article but added more features to his work.

The language of choice is Javascript because it allows me to share the project as a simple web page. As much as I prefer Python I took the challenge to work with Javascript. So the tasks involved are,

- Converting RGB to Grayscale: So we start with converting the RGB image to grayscale by averaging the r, g, b values into a single grayscale value. When I said taking the average, I meant weighted average because the human eye is not equally sensitive to these channels.

  $$ GrayScale = 0.21 R + 0.72 G + 0.07 B $$

  <img src="C:\Users\dhpra\Downloads\hattori_color_grayscale.jpg" style="zoom:33%;" />

- Rescaling the image: Luckily JS canvas takes care of it for us. So we just have to specify the maximum height or width with a slider and we get a rescaled image. Also, I had to make sure that the aspect ratio remains the same.

- Adjusting the width to balance the font’s height-width ratio: Characters tend to be taller than they are wide. To counteract this we stretch the input image proportional to the height to width ratio of the font. Which is a thing I learned from the blog post.

  ![](C:\Users\dhpra\Downloads\hattori_streched.png)

- Mapping each pixel to character: This is straightforward. Let’s say we have n characters then we normalize the grayscale value from [0, 255] to [0, n-1]. And based on the normalized index `i`, we assign the `i`^th^ character to the pixel.

  <img src="C:\Users\dhpra\Downloads\hattori_comparison.jpg" alt="hattori_comparison" style="zoom:50%;" />

- Making the result downloadable: The blog post adds the characters to a paragraph and shows them. After some quick searches in the Stackoverflow I managed to make the output downloadable as a text file or a rasterized image.

**Final Result:**

We have completed our simple challenge and the code is in a Github [repo](https://github.com/harshapraneeth/image_to_ascii) and here is a [demo](http://image2ascii.glitch.me/).
