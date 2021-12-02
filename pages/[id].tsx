import { tabsListUnstyledClasses } from "@mui/base";
import { NextPage } from "next";

const Details: NextPage = (props) => {
  return (
    <div>
      <h1>{props.task.taskName.S}</h1>
    </div>
  );
};

export const getStaticPaths = async () => {
  const res = await fetch("https://timecheck.vercel.app/api/tasks", {
    method: "GET",
  });
  const data = await res.json();

  const paths = data.map((task) => {
    return { params: { id: task.taskId.S } };
  });
  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const id = context.params.id;
  const res = await fetch(`https://timecheck.vercel.app/api/tasks/${id}`);
  const data = await res.json();

  return {
    props: { task: data },
  };
};

export default Details;
