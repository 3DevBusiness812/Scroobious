import { getContainer } from '../../../core';
import { BatchJob, JobProcessorOptions } from '../../../core/types';
import { UserService } from '../../identity/user/user.service';
import { CourseService } from '../../courses/course/course.service';
import { StripeWebhookEvent } from './stripe-webhook-event.model';
import { CourseProductService } from '../../courses/course-product/course-product.service';

const EVENT_TYPE = 'stripe_webhook_event.create';

const queue: BatchJob<StripeWebhookEvent> = {
  name: EVENT_TYPE,
  process,
};

async function process({
  debug,
  data,
  userId,
}: JobProcessorOptions<StripeWebhookEvent>): Promise<void> {
  console.log('userId :>> ', userId);
  console.log('data :>> ', data);
  const userService = getContainer(UserService);
  const courseService = getContainer(CourseService);
  const courseProductService = getContainer(CourseProductService);

  debug(`processing ${EVENT_TYPE}: ${JSON.stringify(data)}`);
  const stripeEventType = data.type;

  console.log('stripeEventType :>> ', stripeEventType);

  const userType = (data as any)?.raw?.data?.object?.plan?.metadata?.user_type;
  console.log('userType :>> ', userType);
  const stripeCustomerId = (data as any)?.raw?.data?.object?.customer;
  console.log('stripeCustomerId :>> ', stripeCustomerId);
  const clientReferenceId = (data as any).raw?.data?.object?.client_reference_id;
  console.log("Client Reference ID", clientReferenceId);

  switch (stripeEventType) {
    case 'customer.subscription.deleted':
      const user = await userService.findByStripeCustomerId(stripeCustomerId);
      console.log('Subscription cancelled, de-activating user',user.id)
      await userService.updateStatus(user.id, 'INACTIVE_USER', user.id);      
      break;

    case 'customer.subscription.updated':
      const userToUpdate = await userService.findByStripeCustomerId(stripeCustomerId);

      await userService.updateCapability(userToUpdate.id, userType);

    case 'checkout.session.completed':
      const stripeUserId = (data as any)?.raw?.data?.object?.customer;
      const clientReferenceId = (data as any).raw?.data?.object?.client_reference_id;
      console.log("Client Reference ID", clientReferenceId);

      if (clientReferenceId !== null) { 
        const user = await userService.findById(clientReferenceId);
        // console.log("USER BY CLIENT REFERENCE >>>>", user);
        await userService.updateStatus(user.id, 'START_ONBOARDING', user.id); 
        await userService.update({stripeUserId: stripeUserId}, {id: user.id}, user.id)
      }

      const email = (data as any).raw?.data?.object?.customer_details?.email;

      const userByEmail = await userService.findByEmailAddress(email);

      const courseByOwner = await courseService.findByOwnerId(userByEmail.id);

      const product = (data as any).raw?.data?.object?.metadata?.product;

      const productId = (data as any).raw?.data?.object?.metadata?.productId;
      
    
      if (product === 'written') {
        await courseProductService.createSingleCourse({ courseId: courseByOwner.id, productId: productId, ownerId: userByEmail.id })
      }
      if (product === 'zoom') {
        await courseProductService.createSingleCourse({ courseId: courseByOwner.id, productId: productId, ownerId: userByEmail.id })
      }

    case 'charge.succeeded':

      const zoomEmail = (data as any).raw?.data?.object?.receipt_email;

      const userByZoomEmail = await userService.findByEmailAddress(zoomEmail);

      const zoomCourseByOwner = await courseService.findByOwnerId(userByZoomEmail.id);

      const zoomProductId = '0ngZhHipPZfzNy3BVk2C4';

      await courseProductService.createSingleCourse({ courseId: zoomCourseByOwner.id, productId: zoomProductId, ownerId: userByZoomEmail.id });

    default:
      "ERROR: No Stripe event sent"
  }

  // if (stripeEventType === 'customer.subscription.updated' || stripeEventType === 'customer.subscription.deleted') {

  //   const user = await userService.findByStripeCustomerId(stripeCustomerId);

  //   console.log('user :>> ', user);
  //   console.log('stripeEventType:>> ', stripeEventType);
  //   console.log('stripeEventMetaData:>> ', (data as any).raw?.data?.object);

  //   if (stripeEventType === 'customer.subscription.updated') {
  //     await userService.updateCapability(user.id, userType);
  //   }
  //   if (stripeEventType === 'customer.subscription.deleted') {
  //     // await userService.updateCapability(user.id, userType);
  //     console.log('DELETING USER');
  //   }
  // }

  // console.log('stripeEventType:>> ', stripeEventType);
  // console.log('stripeEventMetaData:>> ', (data as any).raw?.data?.object?.metadata);

  // if (stripeEventType === 'checkout.session.completed') {
  //   const productId = (data as any).raw?.data?.object?.metadata?.productId;
  //   if (productId === 'written') {
  //     console.log('[DEBUG] => Process written');
  //   }
  //   if (productId === 'zoom') {
  //     console.log('Process zoom');
  //   }
  // }
}

export default queue;
