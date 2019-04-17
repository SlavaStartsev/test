import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID, FieldResolver, Root } from 'type-graphql';

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'text', unique: true })
  username: string;

  @Field()
  creds(@Root() { username, email }: User): string {
    return `${username} => ${email}`;
  }

  @Field()
  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'boolean', default: false })
  confirmed: boolean;

  // @Field(() => String, { nullable: true })
  // @Column({ type: "text", nullable: true })
  // name: string | null;

  // @Column({ type: "text", unique: true })
  // githubId: string;

  // @Field()
  // @Column({ type: "text" })
  // pictureUrl: string;

  // @Field()
  // @Column({ type: "text" })
  // bio: string;

  // @OneToMany(() => CodeReviewQuestion, crq => crq.creator)
  // codeReviewQuestions: Promise<CodeReviewQuestion[]>;

  // @OneToMany(() => CodeReviewPost, crp => crp.creator)
  // codeReviewPosts: Promise<CodeReviewPost[]>;

  // @OneToMany(() => QuestionReply, qr => qr.creator)
  // questionReply: Promise<QuestionReply[]>;

  // @Field(() => String, { nullable: true })
  // accessToken: string | null;
}
