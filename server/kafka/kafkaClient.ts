import { Kafka, Producer, Consumer } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'project-sentry',
  brokers: ['localhost:9092'],
  retry: {
    retries: 0
  }
});

let producer: Producer | null = null;

export const getKafkaProducer = async (): Promise<Producer> => {
  if (!producer) {
    producer = kafka.producer();
    await producer.connect().catch(() => {
      console.log('Kafka not available - running in simulation mode');
      producer = null;
    });
  }
  return producer as Producer;
};

export const createKafkaConsumer = (groupId: string): Consumer => {
  return kafka.consumer({ groupId });
};

export const sendKafkaMessage = async (topic: string, message: any) => {
  try {
    const prod = await getKafkaProducer();
    if (prod) {
      await prod.send({
        topic,
        messages: [
          {
            value: JSON.stringify(message),
          },
        ],
      });
      console.log(`Message sent to topic ${topic}`);
    } else {
      console.log(`Kafka simulation: Message for topic ${topic}`, message);
    }
  } catch (error) {
    console.log(`Kafka simulation mode: ${topic}`, message);
  }
};

export default kafka;
