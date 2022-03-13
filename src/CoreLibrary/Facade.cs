namespace CoreLibrary;

using CoreLibrary.Ports.Out;

public class Facade
{
    private IRepository Repository;

    public Facade(IRepository Repository)
    {
        this.Repository = Repository;
    }
}