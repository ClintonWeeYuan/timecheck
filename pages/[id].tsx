import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";

interface IParams extends ParsedUrlQuery {
  id: string;
}

interface Props {
  task: {
    endTime: {
      N: "string";
    };
    startTime: {
      N: "string";
    };
    taskName: {
      S: "string";
    };
  };
}

const Details: NextPage<Props> = (props) => {
  return (
    <div>
      <h1>{props.task.taskName.S}</h1>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch("https://timecheck.vercel.app/api/tasks", {
    method: "GET",
  });
  const data = await res.json();

  const paths = data.map((task: { taskId: { S: string } }) => {
    return { params: { id: task.taskId.S } };
  });
  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as IParams;
  const res = await fetch(`https://timecheck.vercel.app/api/tasks/${id}`);
  const data = await res.json();

  return {
    props: { task: data },
  };
};

export default Details;
