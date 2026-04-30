import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addCategory,
  fetchAllCategories,
  uploadCategoryIcon,
} from "@/store/admin/categories-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UploadCloudIcon } from "lucide-react";

const initialCategories = [
  { id: "wallet", label: "Wallet" },
  { id: "belts", label: "Belts" },
  { id: "laptop-bags", label: "Laptop Bags" },
  { id: "duffle-bags", label: "Duffle Bags" },
  { id: "jacket", label: "Jacket" },
  { id: "accessories", label: "Accessories" },
];

function AdminCategories() {
  const dispatch = useDispatch();
  const { categoryList, isFullyLoaded } = useSelector(
    (state) => state.adminCategories,
  );
  const [imageFiles, setImageFiles] = useState({});

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  console.log("Category List:", categoryList);

  // Initialize categories if missing
  useEffect(() => {
    if (isFullyLoaded && categoryList) {
      initialCategories.forEach((cat) => {
        if (!categoryList.find((c) => c.id === cat.id)) {
          dispatch(addCategory(cat));
        }
      });
    }
  }, [categoryList, isFullyLoaded, dispatch]);

  function handleImageFileChange(event, categoryId) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setImageFiles((prev) => ({ ...prev, [categoryId]: selectedFile }));
    }
  }

  function handleUploadIcon(categoryId) {
    const file = imageFiles[categoryId];
    if (!file) return;

    const formData = new FormData();
    formData.append("my_file", file);

    dispatch(uploadCategoryIcon({ id: categoryId, formData })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllCategories());
        setImageFiles((prev) => {
          const newState = { ...prev };
          delete newState[categoryId];
          return newState;
        });
      }
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {initialCategories.map((category) => {
        const serverCategory = categoryList?.find((c) => c.id === category.id);
        const icon = serverCategory?.collection_icon;

        return (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.label}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
                {icon ? (
                  <img
                    src={icon}
                    alt={category.label}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">No Icon</span>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <Input
                  type="file"
                  onChange={(e) => handleImageFileChange(e, category.id)}
                  className="w-full"
                />
                <Button
                  onClick={() => handleUploadIcon(category.id)}
                  disabled={!imageFiles[category.id]}
                >
                  <UploadCloudIcon className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default AdminCategories;
