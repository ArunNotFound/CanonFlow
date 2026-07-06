namespace Canon.Flow

open System
open System.Threading
open Confluent.Kafka
open Canon.Flow.Debezium

/// A background consumer loop that subscribes to Debezium CDC topics
/// and parses the incoming schema changes/data into our F# domain.
module KafkaConsumer =

    let startConsuming (brokerList: string) (topic: string) (cancellationToken: CancellationToken) =
        let config = ConsumerConfig(
            BootstrapServers = brokerList,
            GroupId = "canonflow-consumer-group",
            AutoOffsetReset = AutoOffsetReset.Earliest
        )
        
        use consumer = ConsumerBuilder<Ignore, string>(config).Build()
        consumer.Subscribe(topic)

        printfn $"Starting Canon.Flow consumer on topic: {topic}"

        try
            while not cancellationToken.IsCancellationRequested do
                let consumeResult = consumer.Consume(cancellationToken)
                if not (String.IsNullOrEmpty(consumeResult.Message.Value)) then
                    // 1. Parse the raw JSON using our Debezium Envelope codec
                    try
                        // Use a basic mapping assuming 'T is a JsonElement or Dictionary for dynamic data
                        let envelope = parse<obj>(consumeResult.Message.Value)
                        
                        // 2. Here you would map envelope.payload into CanonFlow Events 
                        // and push them into Equinox / OpenSearch!
                        printfn $"[CDC EVENT] Op: {envelope.payload.op}, Timestamp: {envelope.payload.ts_ms}"
                    with ex ->
                        printfn $"Failed to parse CDC message: {ex.Message}"
        with
        | :? OperationCanceledException ->
            consumer.Close()
