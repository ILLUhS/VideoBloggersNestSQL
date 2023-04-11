import { Injectable } from '@nestjs/common';
import { ReactionDtoType } from '../types/reaction-dto.type';

@Injectable()
export class QueryMapHelpers {
  async likesInfoMap(reactions: ReactionDtoType[], userId: number) {
    let myStatus = 'None';
    let likesCount = 0;
    let dislikesCount = 0;
    if (reactions.length > 0) {
      reactions.forEach((r) => {
        if (userId && r.userId === userId) myStatus = r.reaction;
        if (r.reaction === 'Like') likesCount++;
        else if (r.reaction === 'Dislike') dislikesCount++;
      });
    }
    return {
      likesCount: likesCount,
      dislikesCount: dislikesCount,
      myStatus: myStatus,
    };
  }
  async newestLikesMap(reactions: ReactionDtoType[]) {
    //фильтруем копию массива, оставляем только лайки, потом сортируем лайки по дате
    const newestLikes = reactions
      .filter((like) => like.reaction === 'Like')
      .sort(function (a, b) {
        if (a.createdAt > b.createdAt) {
          return -1;
        }
        if (a.createdAt < b.createdAt) {
          return 1;
        }
        return 0;
      });
    newestLikes.splice(3); //берем первые три лайка
    return newestLikes.map((like) => ({
      addedAt: String(like.createdAt),
      userId: String(like.userId),
      login: like.login,
    }));
  }
}
