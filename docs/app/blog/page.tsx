export default async function BlogIndexPage() {
  const blogs = (await getAllBlogsFrontmatter()).sort(
    (a, b) => stringToDate(b.date).getTime() - stringToDate(a.date).getTime()
  );

  if (blogs.length === 0) {
    return (
      <div className="flex flex-col gap-1 sm:min-h-[91vh] min-h-[88vh] pt-2">
        <div className="mb-7 flex flex-col gap-2">
          <h1 className="sm:text-3xl text-2xl font-extrabold">
            No Blogs Yet
          </h1>
          <p className="text-muted-foreground sm:text-[16.5px] text-[14.5px]">
            There are currently no blogs available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 sm:min-h-[91vh] min-h-[88vh] pt-2">
      <div className="mb-7 flex flex-col gap-2">
        <h1 className="sm:text-3xl text-2xl font-extrabold">
          The latest blogs of this product
        </h1>
        <p className="text-muted-foreground sm:text-[16.5px] text-[14.5px]">
          All the latest blogs and news, straight from the team.
        </p>
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-8 gap-4 mb-5">
        {blogs.map((blog) => (
          <BlogCard {...blog} slug={blog.slug} key={blog.slug} />
        ))}
      </div>
    </div>
  );
}
