import React from "react";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

function EachComment(props) {
  return(
    <div  className="postDetail__eachComment">
      <div className="postDetail__eachCommentContent">
        <div
          className="postDetail__commentProfile"
          style={{
            backgroundImage: `url(${props.commentUserData?.profileImageUrl})`,
          }}
        />
        <div className="postDetail__commentInfo">
          <div className="postDetail__commentInfo-upper">
            <p>{props.commentUserData?.username}</p>
            &nbsp;<p> • </p>&nbsp;
            <p>{props.el?.date?.toDate().toLocaleString()}</p>
          </div>
          <br />
          <pre>{props.el?.caption}</pre>
        </div>
      </div>
      {
        props.userUID==props.el?.uid?
        <div className="postDetail__editComment" onClick={()=>props.deleteComment(props.el)}>
          <DeleteSweepIcon sx={{ color: "#dfdfdf" }} />
        </div>
        :
        null
      }
    </div>
  );
}

export default EachComment;
