import { memo } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { formatDistance, format } from "date-fns";
import { Heart, Bin, Comment, Share } from "~icons";
import * as S from "./styled";
import { colors } from "~theme";
import { Tweet as TweetType, User } from "~graphql/generated/graphql";
import { getNameInitials } from "~utils";
import ButtonWithCounter from "~components/ButtonWithCounter";
import { RootStoreState } from "~store";

export type TweetProps = TweetType & {
  isComment?: boolean;
  showCommentLine?: boolean;
  haveLikedTweet?: boolean;
  onLikeTweet: (id: string) => void;
  onDeleteTweet: (id: string) => void;
  onDeslikeTweet: (id: string) => void;
  user?: Pick<User, "_id">;
};

const Tweet = ({
  isComment,
  _id,
  onDeleteTweet,
  onLikeTweet,
  likedBy,
  haveLikedTweet,
  onDeslikeTweet,
  name,
  userName,
  showCommentLine,
  content,
  authorId,
  user,
  createdAt,
  avatarColor,
  commentsCounter,
}: TweetProps): JSX.Element => {
  const router = useRouter();
  const dateDesktop = formatDistance(new Date(createdAt), new Date());
  const dateMobile = format(new Date(createdAt), "MMM/yyyy");

  const onClickHandler = () => {
    if (isComment) return false;
    router.push(`/tweet/${_id}`);
  };

  const onClickInside = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
  };

  const onLikeTweetHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    haveLikedTweet ? onDeslikeTweet(_id) : onLikeTweet(_id);
  };

  const onDeleteTweetHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDeleteTweet(_id);
  };

  const onShareHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const url = `${window.location.origin}/tweet/${_id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Clone Twitter",
          text: "Hey, look at this tweet.",
          url,
        });
        return false;
      }
      console.log("copiado");
    } catch (err) {
      console.log("copiado");
    }
  };

  return (
    <S.Card tabIndex={0} onClick={onClickHandler}>
      <S.Avatar
        isComment={isComment || showCommentLine}
        onClick={onClickInside}
        href={`/user/${authorId}`}
        tabIndex={0}
        avatarColor={avatarColor}
      >
        {getNameInitials(userName)}
      </S.Avatar>
      <S.TweetContent>
        <S.Header>
          <S.Name
            onClick={onClickInside}
            href={`/user/${authorId}`}
            tabIndex={0}
          >
            {name}
          </S.Name>
          <S.Username>
            @{userName} · <S.ShowOnMobile>{dateMobile}</S.ShowOnMobile>
            <S.ShowOnDesktop>{dateDesktop}</S.ShowOnDesktop>
          </S.Username>
        </S.Header>
        <S.Content>
          <S.Text>{content}</S.Text>
        </S.Content>
        <S.Footer>
          {user._id !== authorId && (
            <ButtonWithCounter
              onClick={onLikeTweetHandler}
              rounded
              variant="danger"
              counter={likedBy.length}
              Icon={
                <Heart
                  width={20}
                  color={haveLikedTweet ? colors.red : colors.lightLighten}
                />
              }
            />
          )}
          {user._id === authorId && (
            <ButtonWithCounter
              onClick={onDeleteTweetHandler}
              rounded
              variant="danger"
              Icon={<Bin width={20} />}
            />
          )}
          {!isComment && (
            <ButtonWithCounter
              rounded
              counter={commentsCounter}
              variant="blue"
              Icon={<Comment color={colors.lightLighten} />}
            />
          )}
          {!isComment && (
            <ButtonWithCounter
              variant="green"
              rounded
              onClick={onShareHandler}
              Icon={<Share />}
            />
          )}
        </S.Footer>
      </S.TweetContent>
    </S.Card>
  );
};

const MemorizedTweet = memo(Tweet);

export default connect(({ user }: RootStoreState, props) => ({
  user,
  ...props,
}))(MemorizedTweet);
