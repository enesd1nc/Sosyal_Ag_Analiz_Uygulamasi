public class UserNode {
    public int ID { get; set; }
    public string Name { get; set; }
    [cite_start]// CSV'den gelecek özellikler [cite: 56]
    public double ActivityScore { get; set; }
    public double InteractionScore { get; set; }
    // Görsel konum
    public float X { get; set; }
    public float Y { get; set; }
}

public class RelationshipEdge {
    public UserNode Source { get; set; }
    public UserNode Target { get; set; }
    
    [cite_start]// Formüle göre hesaplanan ağırlık 
    public double GetWeight() {
        double actDiff = Source.ActivityScore - Target.ActivityScore;
        double intDiff = Source.InteractionScore - Target.InteractionScore;
        // ... diğer özellikler
        return 1 + Math.Sqrt(Math.Pow(actDiff, 2) + Math.Pow(intDiff, 2));
    }
}