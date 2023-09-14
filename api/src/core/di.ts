import { Container } from 'typedi';
import { ClassType } from 'warthog';

// eslint-disable-next-line @typescript-eslint/ban-types
export function getContainer<T extends ClassType>(container: T): InstanceType<T> {
  // console.log('container :>> ', container);

  let result: InstanceType<T>;
  try {
    // console.log('Getting container', container, container.name)
    Container.import([container]);
    // Not sure why I have to do this `set` here, the @Service decorator should be doing this
    // Container.set(container.name, container)
    result = Container.get(container.name);
  } catch (error) {
    console.error(container, error, error.stack);
    throw error;
  }

  return result;
}
