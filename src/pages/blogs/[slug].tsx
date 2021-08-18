import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import NotFound from "../../components/global/NotFound";
import CardVert from "../../components/cards/CardVert";
import Pagination from "../../components/global/Pagination";

import { IBlog, IParams, RootStore } from "../../utils/TypeScript";
import { getBlogsByCategoryId } from "../../redux/actions/blogAction";

function BlogsByCategory() {
  const { categories, blogsCategory } = useSelector(
    (state: RootStore) => state
  );
  const dispatch = useDispatch();
  const { slug } = useParams<IParams>();

  const [categoryId, setCategoryId] = useState("");
  const [blogs, setBlogs] = useState<IBlog[]>();
  const [total, setTotal] = useState(0);

  const history = useHistory();
  const { search } = history.location;

  useEffect(() => {
    const category = categories.find((item) => item.name === slug);
    if (category) setCategoryId(category._id);
  }, [slug, categories]);

  useEffect(() => {
    if (!categoryId) return;

    if (blogsCategory.every((item) => item.id !== categoryId)) {
      dispatch(getBlogsByCategoryId(categoryId, search));
    } else {
      const data = blogsCategory.find((item) => item.id === categoryId);
      if (!data) return;

      setBlogs(data.blogs);
      setTotal(data.total);
      if (data.search) history.push(data.search);
    }
  }, [categoryId, blogsCategory, dispatch, search, history]);

  const handlePagination = (num: number) => {
    const search = `?page=${num}`;
    dispatch(getBlogsByCategoryId(categoryId, search));
  };

  if (!blogs) return <NotFound />;

  return (
    <div className="blogs_category">
      <div className="show_blogs">
        {blogs.map((blog) => (
          <CardVert key={blog._id} blog={blog} />
        ))}
      </div>

      {total > 1 && <Pagination total={total} callback={handlePagination} />}
    </div>
  );
}

export default BlogsByCategory;
