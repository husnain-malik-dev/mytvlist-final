import {
    NodeHandler,
    NodeHandlers,
    TipTapRender,
  } from "@troop.com/tiptap-react-render";

  const doc: NodeHandler = (props) => {
    return <>{props.children}</>;
  };

  const paragraph: NodeHandler = (props) => {
    return <p className="mb-4 leading-relaxed">{props.children}</p>;
  };

  const text: NodeHandler = (props) => {
    let content = <span className="inline-block">{props.node.text}</span>;

    // Handle marks on text nodes
    if (props.node.marks) {
      props.node.marks.forEach((mark: any) => {
        switch (mark.type) {
          case 'bold':
            content = <strong className="font-bold inline-block">{content}</strong>;
            break;
          case 'italic':
            content = <em className="italic inline-block">{content}</em>;
            break;
          case 'strike':
            content = <del className="line-through inline-block">{content}</del>;
            break;
        }
      });
    }

    return content;
  };

  const heading: NodeHandler = (props) => {
    const level = props.node.attrs?.level || 1;
    const className = level === 1
      ? "text-3xl font-bold mb-4 mt-6"
      : level === 2
      ? "text-2xl font-bold mb-3 mt-5"
      : "text-xl font-bold mb-2 mt-4";

    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    return <Tag className={className}>{props.children}</Tag>;
  };

  const handlers: NodeHandlers = {
    doc: doc,
    text: text,
    paragraph: paragraph,
    heading: heading,
  };
  
  export function RenderToJson({ data }: { data: any }) {
    return (
      <div className="px-2 pt-2 prose dark:prose-invert">
        <TipTapRender handlers={handlers} node={data} />
      </div>
    );
  }