import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage } from "@cloudinary/react";

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dpchrprmg",
  },
});

/**
 * CloudinaryImage component for optimized image delivery.
 * @param {string} publicId - The Cloudinary public ID of the image.
 * @param {string} alt - Alt text for the image.
 * @param {number} width - Optional width for the image.
 * @param {number} height - Optional height for the image.
 * @param {string} className - Optional CSS class name.
 */
function CloudinaryImage({
  publicId,
  alt,
  width = 500,
  height = 500,
  className,
}) {
  const img = cld
    .image(publicId)
    .format("auto")
    .quality("auto")
    .resize(auto().gravity(autoGravity()).width(width).height(height));

  return <AdvancedImage cldImg={img} alt={alt} className={className} />;
}

export default CloudinaryImage;
