namespace PortCosmosRepositoryTest;

using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Threading.Tasks;

using CoreLibrary.Ports.Out;

[TestClass]
public class RepositoryTest : PortRepositoryTest.AbstractRepositoryTest
{
    public override async Task<IRepository> newRepository() =>
        await Task.Run(() => new PortCosmosRepository.Repository());
}
