import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../../../domain/schemas/post.schema';
import { QueryParamsDto } from '../../../super-admin/api/dto/query-params.dto';
import { FilterQueryType } from '../../types/filter.query.type';
import { QueryMapHelpers } from '../query-map.helpers';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsQueryRepository extends QueryMapHelpers {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectModel(Post.name) protected postModel: PostModelType,
  ) {
    super();
  }

  async getPotsWithQueryParam(
    searchParams: QueryParamsDto,
    filter: FilterQueryType = {}, //установка дефолтного значения
    userId = '',
  ) {
    const posts = await this.postModel
      .find(filter)
      .where({ isBanned: false })
      .populate({ path: 'reactions', match: { isBanned: false } })
      .skip((searchParams.pageNumber - 1) * searchParams.pageSize)
      .limit(searchParams.pageSize)
      .sort([[searchParams.sortBy, searchParams.sortDirection]])
      .select({ _id: 0, __v: 0 })
      .exec();
    const postsCount = await this.postModel
      .countDocuments(filter)
      .where({ isBanned: false })
      .exec();
    return {
      pagesCount: Math.ceil(postsCount / searchParams.pageSize),
      page: searchParams.pageNumber,
      pageSize: searchParams.pageSize,
      totalCount: postsCount,
      items: await Promise.all(
        posts.map(async (post) => {
          const likesInfoMapped = await this.likesInfoMap(
            post.reactions,
            userId,
          );
          const newestLikesMapped = await this.newestLikesMap([
            ...post.reactions,
          ]);
          return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
              likesCount: likesInfoMapped.likesCount,
              dislikesCount: likesInfoMapped.dislikesCount,
              myStatus: likesInfoMapped.myStatus,
              newestLikes: newestLikesMapped,
            },
          };
        }),
      ),
    };
  }
  async findPostById(id: string, userId = '') {
    const post = await this.postModel
      .findOne({ id: id })
      .where({ isBanned: false })
      .populate({ path: 'reactions', match: { isBanned: false } })
      .select({ _id: 0, __v: 0 })
      .exec();
    if (!post) return null;
    const likesInfoMapped = await this.likesInfoMap(post.reactions, userId);
    const newestLikesMapped = await this.newestLikesMap([...post.reactions]);
    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: likesInfoMapped.likesCount,
        dislikesCount: likesInfoMapped.dislikesCount,
        myStatus: likesInfoMapped.myStatus,
        newestLikes: newestLikesMapped,
      },
    };
  }
  /*async getBlogsWithOwnerInfo(id: number, userId = '') {
    const sql = format(
      `SELECT
                p."id",
                "title", 
                "shortDescription", 
                "content", 
                "blogId", 
                p."createdAt",
                l."userId",
                l."createdAt" as "likeDate",
                "reaction",
                "login"
                FROM public."Posts" as p
                JOIN public."Blogs" as b
                ON p."blogId" = b."id"
                LEFT JOIN (
                SELECT "postId", 
                "userId",
                lp."createdAt",
                "reaction",
                "login"
                FROM public."LikeForPost" as lp
                JOIN public."Users"
                ON "userId" = "id") as l
                ON l."postId" = p."id"
                WHERE b."isBanned" IS FALSE
                AND p."id" = 1$s
                ORDER BY l."createdAt" DESC;`,
      id,
    );
    const blogs = await this.dataSource.query(sql);
    return {
      pagesCount: Math.ceil(blogsCount / searchParams.pageSize),
      page: searchParams.pageNumber,
      pageSize: searchParams.pageSize,
      totalCount: Number(blogsCount),
      items: blogs.map((blog) => ({
        id: blog.id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
        blogOwnerInfo: {
          userId: blog.userId,
          userLogin: blog.login,
        },
        banInfo: {
          isBanned: blog.isBanned,
          banDate: blog.banDate,
        },
      })),
    };
  }*/
}
