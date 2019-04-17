import { ClassType, Field, InputType } from 'type-graphql';

export const extendClass = <T extends ClassType>(BaseClass: T) => {
  @InputType()
  class ExtendedClass extends BaseClass {
    @Field()
    ok: boolean;
  }
  return ExtendedClass;
};
