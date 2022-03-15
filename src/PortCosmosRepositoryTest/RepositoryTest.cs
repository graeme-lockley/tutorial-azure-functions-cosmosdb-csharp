namespace PortCosmosRepositoryTest;

using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Threading.Tasks;

using CoreLibrary.Ports.Out;
using PortCosmosRepository;
using PortRepositoryTest;

[TestClass]
public class RepositoryTest : AbstractRepositoryTest
{
    public override async Task<IRepository> newRepository() =>
        await Task.Run(() => new Repository());
}
